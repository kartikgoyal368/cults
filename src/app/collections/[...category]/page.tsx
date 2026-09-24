import prisma from '@/lib/prisma';
import CollectionClient from './CollectionClient';

export default async function CatchAllCollectionPage({
  params,
}: {
  params: Promise<{ category: string[] }>;
}) {
  const resolvedParams = await params;
  const segments = resolvedParams.category || ['all'];
  const fullSlug = segments.join('/').toLowerCase();
  const lastSegment = segments[segments.length - 1].toLowerCase();

  // Format title (e.g., 'tank-top' -> 'TANK TOP', 'hoodies' -> 'HOODIES')
  const categoryTitle = lastSegment.replace(/-/g, ' ').toUpperCase();

  // Smart Query Filter
  let whereClause: any = undefined;
  let isBottomsComingSoon = false;
  let categoryDesc = `Explore our latest archive releases in ${categoryTitle.toLowerCase()}. Pure heavyweight cotton, hand-finished in India.`;

  if (fullSlug === 'all' || fullSlug === 'new') {
    whereClause = undefined;
    categoryDesc = 'Full archive vault drops. Limited edition heavyweight streetwear. No restocks.';
  } else if (fullSlug.includes('bottoms') || lastSegment === 'bottoms' || lastSegment === 'baggy' || lastSegment === 'cargos' || lastSegment === 'denim' || lastSegment === 'shorts') {
    isBottomsComingSoon = true;
    whereClause = { category: 'bottoms' };
  } else if (lastSegment.includes('hoodie') || lastSegment.includes('sweatshirt')) {
    whereClause = {
      OR: [
        { name: { contains: 'Hoodie', mode: 'insensitive' } },
        { name: { contains: 'Sweatshirt', mode: 'insensitive' } },
        { description: { contains: 'Hoodie', mode: 'insensitive' } },
      ],
    };
  } else if (lastSegment.includes('tank')) {
    whereClause = {
      OR: [
        { name: { contains: 'Tank', mode: 'insensitive' } },
        { description: { contains: 'Tank', mode: 'insensitive' } },
      ],
    };
  } else if (lastSegment.includes('tshirt') || lastSegment.includes('tee') || lastSegment.includes('full-sleeve') || lastSegment.includes('baby-tee')) {
    whereClause = {
      OR: [
        { name: { contains: 'Tee', mode: 'insensitive' } },
        { name: { contains: 'T-Shirt', mode: 'insensitive' } },
        { description: { contains: 'Tee', mode: 'insensitive' } },
      ],
    };
  } else if (lastSegment === 'tops') {
    // All current pieces are tops
    whereClause = undefined;
    categoryDesc = 'Artisan heavyweight graphic tees, mineral wash tanks, boxy silhouettes, and French terry fleece.';
  } else if (lastSegment === 'street-wear') {
    whereClause = { category: 'street-wear' };
  } else if (lastSegment === 'basics') {
    whereClause = { category: 'basics' };
  } else {
    // Fallback: match by category or name contains segment
    whereClause = {
      OR: [
        { category: { contains: lastSegment, mode: 'insensitive' } },
        { name: { contains: lastSegment, mode: 'insensitive' } },
      ],
    };
  }

  const productsData = await prisma.product.findMany({
    where: whereClause,
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  });

  const products = productsData.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    tag: p.tag,
    image: p.images[0]?.url || '/images/hero.jpg',
  }));

  return (
    <CollectionClient
      categoryTitle={categoryTitle}
      categoryDesc={categoryDesc}
      products={products}
      isComingSoon={isBottomsComingSoon && products.length === 0}
    />
  );
}
