import { redirect } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import AccountDetailsForm from './AccountDetailsForm';
import styles from './page.module.css';

export default async function AccountDetailsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/details');
  }

  // Fetch user details from DB using id OR email
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
      console.error('Error fetching user for details page:', e);
    }
  }

  const user = {
    id: dbUser?.id || session.user.id || '',
    name: dbUser?.name || session.user.name || '',
    email: dbUser?.email || session.user.email || '',
    phone: dbUser?.phone || '',
    address: dbUser?.address || '',
    role: dbUser?.role || 'USER',
    createdAt: dbUser?.createdAt ? dbUser.createdAt.toISOString() : undefined,
  };

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
        <AccountDetailsForm user={user} />
      </div>
    </div>
  );
}
