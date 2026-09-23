import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import CheckoutClient from './CheckoutClient';
import styles from './page.module.css';

export default async function CheckoutPage() {
  const session = await auth();
  let dbUser = null;

  if (session?.user?.id || session?.user?.email) {
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
      console.error('Error fetching user for checkout:', e);
    }
  }

  const user = {
    name: dbUser?.name || session?.user?.name || '',
    email: dbUser?.email || session?.user?.email || '',
    phone: dbUser?.phone || '',
    address: dbUser?.address || '',
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <CheckoutClient initialUser={user} />
      </div>
    </div>
  );
}
