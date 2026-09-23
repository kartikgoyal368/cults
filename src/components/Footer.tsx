import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>CULT'S</h3>
          <p>The best streetwear clothing brand. Stay authentic.</p>
        </div>
        <div className={styles.section}>
          <h4>Shop</h4>
          <Link href="/">Home</Link>
          <Link href="/collections/all">All Products</Link>
          <Link href="/account">My Account</Link>
        </div>
        <div className={styles.section}>
          <h4>Contact</h4>
          <p>Email: support@cults.com</p>
          <p>Instagram: @cults.streetwear</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} CULT'S. All rights reserved.</p>
      </div>
    </footer>
  );
}
