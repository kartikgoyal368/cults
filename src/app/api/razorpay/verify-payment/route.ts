import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      email,
      name,
      phone,
      total,
      paymentMethodDetail,
    } = body;

    // 1. Verify Razorpay Signature
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification parameters' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Signature mismatch:', { generated: generatedSignature, received: razorpay_signature });
      return NextResponse.json(
        { error: 'Payment verification failed: Invalid cryptographic signature' },
        { status: 400 }
      );
    }

    // 2. Resolve User (Session or Guest by email)
    const session = await auth();
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

    if (!user && email) {
      const normalizedEmail = email.toLowerCase().trim();
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: name || 'Cult Customer',
            phone: phone || null,
            address: shippingAddress || null,
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Customer identification failed' },
        { status: 400 }
      );
    }

    // 3. Format items
    const orderItemsData = (items || []).map((it: any) => ({
      productId: it.productId || null,
      name: it.name || "Cult's Exclusive",
      price: it.price ? String(it.price) : `₹${it.priceNumber || 0}`,
      quantity: Number(it.quantity) || 1,
      size: it.size || 'L',
      imageUrl: it.imageUrl || it.image || '/images/1.png',
    }));

    // 4. Generate order tracking IDs
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `CULT-${randomDigits}`;
    const trackingNumber = `CLT-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

    const methodString = paymentMethodDetail 
      ? `RAZORPAY (${paymentMethodDetail} • ID: ${razorpay_payment_id.slice(-6)})`
      : `RAZORPAY (ID: ${razorpay_payment_id.slice(-8)})`;

    // 5. Create Order in Database
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PROCESSING',
        total: total || '₹0',
        trackingNumber,
        shippingAddress: shippingAddress || 'Standard Shipping Address on File',
        paymentMethod: methodString,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error verifying payment' },
      { status: 500 }
    );
  }
}
