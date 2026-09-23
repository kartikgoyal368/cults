require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  
  const products = [
    // Street Wear (Slider) products
    { 
      id: 'graphic-tee-1', 
      name: 'Girl Graphic Tee', 
      price: '₹1499', 
      category: 'street-wear',
      description: '240 GSM Heavyweight Premium Cotton\nArtisan stitched and screen printed\nPre-shrunk fabric with bio-wash finish\nOversized drop shoulder fit', 
      images: ['/images/1.png'] 
    },
    { 
      id: 'nothing-remains-2', 
      name: 'Nothing Remains Tee', 
      price: '₹1499', 
      category: 'street-wear',
      description: '240 GSM Heavyweight Premium Cotton\nArtisan stitched and screen printed\nPre-shrunk fabric with bio-wash finish\nOversized drop shoulder fit', 
      images: ['/images/2.png'] 
    },
    { 
      id: 'hate-the-sin-3', 
      name: 'Hate the Sin Tee', 
      price: '₹1499', 
      category: 'street-wear',
      description: '240 GSM Heavyweight Premium Cotton\nArtisan stitched and screen printed\nPre-shrunk fabric with bio-wash finish\nOversized drop shoulder fit', 
      images: ['/images/3_new.png'] 
    },
    { 
      id: 'skull-star-4', 
      name: 'Skull Star Sweatshirt', 
      price: '₹2499', 
      category: 'street-wear',
      description: '380 GSM Heavy French Terry Fleece\nHigh-density screen print with star detailing\nRibbed hem and cuffs\nRelaxed streetwear boxy silhouette', 
      images: ['/images/4.png'] 
    },
    { 
      id: 'greatest-hoodie-5', 
      name: 'Greatest Star Hoodie', 
      price: '₹2999', 
      category: 'street-wear',
      description: '420 GSM Ultra-Heavyweight Terry Fleece\nDouble-layered hood with kangaroo pocket\nSignature Cult\'s star embroidery & print\nCustom oversized drape', 
      images: ['/images/5.png'] 
    },
    
    // Cult's Basics products
    { 
      id: 'basics-6', 
      name: 'Cult\'s Star Mineral Wash Tank', 
      price: '₹1199', 
      tag: 'SAVE 35%',
      category: 'basics',
      description: '240 GSM heavy-grade acid wash cotton\nCustom Cult\'s signature star chest print\nRelaxed sleeveless boxy silhouette\nPre-shrunk and bio-washed for vintage drape', 
      images: ['/images/6.JPG'] 
    },
    { 
      id: 'basics-7', 
      name: 'Porsche 911 GT3 RS Blueprint Tee', 
      price: '₹1499', 
      tag: 'SAVE 35%',
      category: 'basics',
      description: '240 GSM 100% combed cotton jersey\nTechnical 911 GT3 RS blueprint & schematic back graphic\nDrop-shoulder streetwear oversized silhouette\nReinforced rib neckline and artisan screen printing', 
      images: ['/images/7.JPG'] 
    },
    { 
      id: 'basics-8', 
      name: 'Amour Oversized Graphic Tee', 
      price: '₹1399', 
      tag: 'SAVE 35%',
      category: 'basics',
      description: 'Premium 240 GSM French terry cotton\nCobalt blue bold typographic AMOUR back art\nOversized boxy drape with structured collar\nHigh-density silk screen print', 
      images: ['/images/8.JPG'] 
    },
    { 
      id: 'basics-9', 
      name: 'Stingers Scorpion Graphic Tee', 
      price: '₹1499', 
      tag: 'SAVE 35%',
      category: 'basics',
      description: '240 GSM heavyweight combed cotton\nIntricate royal cobalt barb wire & scorpion artwork\nDrop-shoulder relaxed street fit\nArtisan screen printed with fade-resistant inks', 
      images: ['/images/9.JPG'] 
    },
    { 
      id: 'basics-10', 
      name: 'Travis Scott Circus Maximus Tour Tee', 
      price: '₹1799', 
      tag: 'SAVE 35%',
      category: 'basics',
      description: 'Vintage washed 260 GSM heavy cotton\nCircus Maximus Tour tribute artwork on front\nVintage distressed aesthetic and washed black tone\nDrop shoulder oversized fit', 
      images: ['/images/10.JPG'] 
    },
    { 
      id: 'basics-11', 
      name: 'N.W.A Ruthless Records Vintage Tee', 
      price: '₹1799', 
      tag: 'SAVE 35%',
      category: 'basics',
      description: 'Heavyweight washed brown 260 GSM cotton\nIconic Ruthless Records tribute graphic with Eazy-E, Dr. Dre & Ice Cube\nHeavy vintage wash with crackle-effect screenprint\nOversized boxy streetwear silhouette', 
      images: ['/images/11.JPG', '/images/nwa.jpg'] 
    },
    { 
      id: 'basics-12', 
      name: 'Scars That Remind Me Of Mercy Tee', 
      price: '₹1399', 
      tag: 'SAVE 35%',
      category: 'basics',
      description: '240 GSM washed jet black premium jersey\nGothic typographic puff print front graphic\nBoxy drop-shoulder relaxed cut\nBio-washed for ultra-soft hand feel', 
      images: ['/images/12.JPG', '/images/sidhe-maut.jpg'] 
    },
    { 
      id: 'basics-13', 
      name: 'Guard Dawgs Gothic Heavyweight Tee', 
      price: '₹1499', 
      tag: 'SAVE 35%',
      category: 'basics',
      description: '260 GSM ultra-heavyweight cotton\nMonochrome gothic Doberman guard dawg front graphic\n"Do not cross your limits" hem typography\nOversized boxy streetwear drape', 
      images: ['/images/13.JPG', '/images/guard-dawgs.jpg'] 
    },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        description: prod.description,
        tag: prod.tag || null,
        category: prod.category || null,
        images: {
          create: prod.images.map(url => ({ url }))
        }
      }
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
