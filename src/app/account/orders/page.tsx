import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import OrdersClient from './OrdersClient';
import styles from './page.module.css';

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/orders');
  }

  // 1. Fetch user from DB
  let dbUser = null;
  if (session.user.id || session.user.email) {
    try {
      dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            ...(session.user.id ? [{ id: session.user.id }] : []),
            ...(session.user.email ? [{ email: session.user.email }] : []),
          ],
        },
      });
    } catch (e) {
      console.error('Error fetching user for orders:', e);
    }
  }

  // 2. Fetch all products from DB
  let allProducts: any[] = [];
  try {
    allProducts = await prisma.product.findMany({
      include: {
        images: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching all products:', e);
  }

  // 3. Fetch user's orders with items
  let orders: any[] = [];
  if (dbUser && prisma.order) {
    try {
      const rawOrders = await prisma.order.findMany({
        where: { userId: dbUser.id },
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      orders = rawOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: o.total,
        trackingNumber: o.trackingNumber,
        shippingAddress: o.shippingAddress,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((it) => ({
          id: it.id,
          productId: it.productId,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          size: it.size,
          imageUrl: it.imageUrl,
        })),
      }));
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Corner Spider Web Graphic */}
      <div className={styles.cornerGraphic}>
        <Image
          src="/images/image.png"
          alt="Spider Web Corner Graphic"
          width={400}
          height={550}
          className={styles.cornerImage}
          priority
        />
      </div>

      <div className={styles.overlay}></div>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Header */}
          <div className={styles.header}>
            <Link href="/account" className={styles.backBtn} title="Back to Account">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <div>
              <h1 className={styles.title}>YOUR ORDERS</h1>
              <p className={styles.subtitle}>
                TRACK SHIPMENTS • VIEW DETAILS • INSTANT REORDER
              </p>
            </div>
          </div>

          {/* Interactive Orders & All Products */}
          <OrdersClient
            initialOrders={orders}
            allProducts={allProducts}
          />
        </div>
      </div>
    </div>
  );
}
