import prisma from '@/lib/prisma';
import SearchClient from './SearchClient';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';

  // Query database for matching products
  const products = await prisma.product.findMany({
    where: q.trim()
      ? {
          OR: [
            {
              name: {
                contains: q.trim(),
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: q.trim(),
                mode: 'insensitive',
              },
            },
          ],
        }
      : undefined,
    include: {
      images: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return <SearchClient products={products} query={q} />;
}
