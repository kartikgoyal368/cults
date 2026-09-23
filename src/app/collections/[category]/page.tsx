import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import prisma from '@/lib/prisma';

export default async function CollectionPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryParam = resolvedParams.category;
  const categoryName = categoryParam.replace('-', ' ').toUpperCase();

  // If category is "all", fetch all products. Otherwise, filter by category.
  const productsData = await prisma.product.findMany({
    where: categoryParam === 'all' ? undefined : { category: categoryParam },
    include: { images: true }
  });

  const products = productsData.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images[0]?.url || '/images/hero.jpg'
  }));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{categoryName}</h1>
        <p className={styles.subtitle}>Explore our latest drops in {categoryName.toLowerCase()}. No restocks.</p>
      </header>

      <div className={styles.grid}>
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard}>
            <div className={styles.imageContainer}>
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className={styles.image}
              />
              <div className={styles.overlay}>
                <button className={`btn ${styles.quickAdd}`}>QUICK ADD</button>
              </div>
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productPrice}>{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
