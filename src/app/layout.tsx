import type { Metadata } from 'next';
import { Inter, Rubik_Dirt } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import CartPopup from '@/components/CartPopup';
import { CartProvider } from '@/context/CartContext';
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Rubik_Dirt({ weight: '400', subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'CULT\'S | Streetwear Clothing Brand',
  description: 'Shop baggy pants, hoodies, baby tees, tank tops & sustainable streetwear clothing. CULT\'S - the best streetwear clothing brand.',
};

import { auth } from '@/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <CartProvider>
          <CartPopup />
          <SmoothScroll>
            <Header session={session} />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
