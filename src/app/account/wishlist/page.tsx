import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import WishlistClient from './WishlistClient';
import styles from './page.module.css';

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/wishlist');
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
      console.error('Error fetching user for wishlist:', e);
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

  // 3. Fetch user's wishlist item IDs
  let wishlistProductIds: string[] = [];
  if (dbUser && prisma.wishlistItem) {
    try {
      const userWishlist = await prisma.wishlistItem.findMany({
        where: { userId: dbUser.id },
        select: { productId: true },
      });
      wishlistProductIds = userWishlist.map((item) => item.productId);
    } catch (e) {
      console.error('Error fetching user wishlist:', e);
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
              <h1 className={styles.title}>MY WISHLIST</h1>
              <p className={styles.subtitle}>
                YOUR CURATED VAULT • {wishlistProductIds.length} ITEMS SAVED
              </p>
            </div>
          </div>

          {/* Interactive Wishlist & All Products */}
          <WishlistClient
            initialWishlistProductIds={wishlistProductIds}
            allProducts={allProducts}
          />
        </div>
      </div>
    </div>
  );
}
