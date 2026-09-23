import { redirect } from 'next/navigation';
import Image from 'next/image';
import { auth, signOut } from '@/auth';
import styles from './page.module.css';
import Link from 'next/link';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account');
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
          <h1 className={styles.title}>MY ACCOUNT</h1>
          <p className={styles.subtitle}>WELCOME BACK, {session.user.name?.toUpperCase() || session.user.email?.toUpperCase()}</p>

          <div className={styles.menuGrid}>
            <Link href="/account/details" className={styles.menuCard}>
              <div className={styles.icon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <h2 className={styles.cardTitle}>ACCOUNT DETAILS</h2>
              <p className={styles.cardDesc}>View and update your personal information.</p>
            </Link>

            <Link href="/account/orders" className={styles.menuCard}>
              <div className={styles.icon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <h2 className={styles.cardTitle}>YOUR ORDERS</h2>
              <p className={styles.cardDesc}>Track, return, or buy items again.</p>
            </Link>

            <Link href="/account/wishlist" className={styles.menuCard}>
              <div className={styles.icon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
              <h2 className={styles.cardTitle}>MY WISHLIST</h2>
              <p className={styles.cardDesc}>View your saved and favorite items.</p>
            </Link>
          </div>

          <form action={async () => {
            "use server"
            await signOut({ redirectTo: '/' });
          }}>
            <button type="submit" className={`btn ${styles.logoutBtn}`}>
              LOGOUT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
