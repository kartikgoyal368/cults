require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('Seeding initial orders and wishlist...');

  // Find user
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('No users found in database to attach orders.');
    return;
  }

  const user = users[0];
  console.log(`Attaching data for user: ${user.email} (${user.id})`);

  // Clear existing orders and wishlist for clean seed
  await prisma.orderItem.deleteMany({
    where: { order: { userId: user.id } }
  });
  await prisma.order.deleteMany({
    where: { userId: user.id }
  });
  await prisma.wishlistItem.deleteMany({
    where: { userId: user.id }
  });

  // Seed Wishlist: add some iconic items
  const wishlistProductIds = [
    'skull-star-4',
    'basics-7',
    'hate-the-sin-3',
    'basics-10',
    'basics-11'
  ];

  for (const pid of wishlistProductIds) {
    const prod = await prisma.product.findUnique({ where: { id: pid } });
    if (prod) {
      await prisma.wishlistItem.create({
        data: {
          userId: user.id,
          productId: pid,
        }
      });
    }
  }
  console.log(`Seeded ${wishlistProductIds.length} wishlist items.`);

  // Seed Orders:
  // Order 1: Delivered
  await prisma.order.create({
    data: {
      orderNumber: 'CULT-94021',
      userId: user.id,
      status: 'DELIVERED',
      total: '₹4,498',
      trackingNumber: 'CLT-DEL-778942',
      shippingAddress: user.address || 'Flat 402, High Street Towers, Mumbai, Maharashtra 400050',
      paymentMethod: 'UPI / Prepaid',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      items: {
        create: [
          {
            productId: 'graphic-tee-1',
            name: 'Girl Graphic Tee',
            price: '₹1499',
            quantity: 1,
            size: 'L',
            imageUrl: '/images/1.png'
          },
          {
            productId: 'greatest-hoodie-5',
            name: 'Greatest Star Hoodie',
            price: '₹2999',
            quantity: 1,
            size: 'XL',
            imageUrl: '/images/5.png'
          }
        ]
      }
    }
  });

  // Order 2: In Transit
  await prisma.order.create({
    data: {
      orderNumber: 'CULT-88310',
      userId: user.id,
      status: 'IN TRANSIT',
      total: '₹1,799',
      trackingNumber: 'CLT-EXP-332910',
      shippingAddress: user.address || 'Flat 402, High Street Towers, Mumbai, Maharashtra 400050',
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      items: {
        create: [
          {
            productId: 'basics-10',
            name: 'Travis Scott Circus Maximus Tour Tee',
            price: '₹1799',
            quantity: 1,
            size: 'M',
            imageUrl: '/images/10.JPG'
          }
        ]
      }
    }
  });

  // Order 3: Processing
  await prisma.order.create({
    data: {
      orderNumber: 'CULT-76504',
      userId: user.id,
      status: 'PROCESSING',
      total: '₹3,298',
      trackingNumber: 'CLT-EXP-910244',
      shippingAddress: user.address || 'Flat 402, High Street Towers, Mumbai, Maharashtra 400050',
      paymentMethod: 'UPI / Prepaid',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      items: {
        create: [
          {
            productId: 'basics-11',
            name: 'N.W.A Ruthless Records Vintage Tee',
            price: '₹1799',
            quantity: 1,
            size: 'L',
            imageUrl: '/images/11.JPG'
          },
          {
            productId: 'basics-13',
            name: 'Guard Dawgs Gothic Heavyweight Tee',
            price: '₹1499',
            quantity: 1,
            size: 'XL',
            imageUrl: '/images/13.JPG'
          }
        ]
      }
    }
  });

  console.log('Successfully seeded Orders and Wishlist!');
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
