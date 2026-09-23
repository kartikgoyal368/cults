import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductClient from './ProductClient';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productData = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { images: true }
  });

  if (!productData) {
    notFound();
  }

  const product = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    description: productData.description || '',
    category: productData.category || '',
    images: productData.images.length > 0 
      ? productData.images.map(img => img.url) 
      : ['/images/hero.jpg']
  };

  return <ProductClient product={product} />;
}
