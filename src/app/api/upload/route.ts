import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'cults/products';
    const productId = formData.get('productId') as string | null;
    const isAvatar = formData.get('isAvatar') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Convert file to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary with automatic WebP/AVIF and quality optimization
    const uploadResult = await uploadToCloudinary(buffer, folder);

    // If an associated productId is provided, save it directly to ProductImage table
    if (productId) {
      await prisma.productImage.create({
        data: {
          productId,
          url: uploadResult.secure_url,
        },
      });
    }

    // If updating user avatar, update User.image in database
    if (isAvatar && (session.user.id || session.user.email)) {
      await prisma.user.updateMany({
        where: {
          OR: [
            ...(session.user.id ? [{ id: session.user.id }] : []),
            ...(session.user.email ? [{ email: session.user.email }] : []),
          ],
        },
        data: {
          image: uploadResult.secure_url,
        },
      });
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload image to Cloudinary' },
      { status: 500 }
    );
  }
}
