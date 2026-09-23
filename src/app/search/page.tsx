import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import styles from './page.module.css';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';

  // Query database for matching products
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      images: true,
    },
  });

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>SEARCH RESULTS</h1>
        <p className={styles.subtitle}>
          {products.length} result{products.length !== 1 ? 's' : ''} for "{q}"
        </p>
      </div>

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => {
            const mainImage = product.images.length > 0 ? product.images[0].url : '/images/hero.jpg';
            return (
              <Link href={`/product/${product.id}`} key={product.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <button className={styles.wishlistBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  <Image src={mainImage} alt={product.name} fill className={styles.image} />
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>{product.price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>We couldn't find any products matching your search.</p>
          <Link href="/" className={styles.backLink}>RETURN HOME</Link>
        </div>
      )}
    </div>
  );
}
