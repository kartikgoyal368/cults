import { Suspense } from 'react';
import Image from 'next/image';
import { auth } from '@/auth';
import AuthForm from './AuthForm';
import styles from './page.module.css';

export default async function LoginPage() {
  const session = await auth();

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
        <Suspense fallback={<div className={styles.formWrapper}><p style={{ color: '#aaa', textAlign: 'center' }}>Loading...</p></div>}>
          <AuthForm sessionUser={session?.user} />
        </Suspense>
      </div>
    </div>
  );
}
