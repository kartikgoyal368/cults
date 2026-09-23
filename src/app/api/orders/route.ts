import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(session.user.id ? [{ id: session.user.id }] : []),
          ...(session.user.email ? [{ email: session.user.email }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    let user = null;

    if (session?.user) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(session.user.id ? [{ id: session.user.id }] : []),
            ...(session.user.email ? [{ email: session.user.email }] : []),
          ],
        },
      });
    }

    if (!user && body.email) {
      const normalizedEmail = body.email.toLowerCase().trim();
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: body.name || 'Cult Customer',
            phone: body.phone || null,
            address: body.shippingAddress || null,
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Customer email or authentication required' }, { status: 400 });
    }
    const {
      items, // array of { productId, name, price, size, quantity, imageUrl }
      productId, // fallback if single product
      size = 'L',
      quantity = 1,
      shippingAddress,
      paymentMethod = 'UPI',
      total: providedTotal,
    } = body;

    // Generate custom orderNumber like CULT-XXXXX
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `CULT-${randomDigits}`;
    const trackingNumber = `CLT-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

    let orderItemsData: any[] = [];
    let calculatedTotal = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      orderItemsData = items.map((it: any) => {
        const numPrice = parseInt(String(it.price).replace(/[^0-9]/g, ''), 10) || 0;
        calculatedTotal += numPrice * (Number(it.quantity) || 1);
        return {
          productId: it.productId || null,
          name: it.name || 'Cult\'s Drop',
          price: it.price ? String(it.price) : `₹${numPrice}`,
          quantity: Number(it.quantity) || 1,
          size: it.size || 'L',
          imageUrl: it.imageUrl || it.image || '/images/1.png',
        };
      });
    } else if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true },
      });

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const numPrice = parseInt(String(product.price).replace(/[^0-9]/g, ''), 10) || 0;
      calculatedTotal = numPrice * (Number(quantity) || 1);

      orderItemsData = [
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: Number(quantity) || 1,
          size: size || 'L',
          imageUrl: product.images[0]?.url || '/images/1.png',
        },
      ];
    } else {
      return NextResponse.json({ error: 'No order items provided' }, { status: 400 });
    }

    const finalTotalString = providedTotal || `₹${calculatedTotal.toLocaleString('en-IN')}`;

    // Optionally update user's saved address in DB if provided
    if (shippingAddress && !user.address) {
      await prisma.user.update({
        where: { id: user.id },
        data: { address: shippingAddress },
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PROCESSING',
        total: finalTotalString,
        trackingNumber,
        shippingAddress: shippingAddress || user.address || 'Standard Shipping Address on File',
        paymentMethod: paymentMethod || 'UPI',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
