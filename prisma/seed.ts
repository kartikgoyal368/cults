import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const products = [
  {
    id: '1',
    name: 'GUARD DAWGS',
    price: '₹1,299',
    tag: 'MOST LOVED',
    category: 'tops',
    description: 'Composition : 200 GSM 100% Cotton Lycra\nBlack Colour\nBiowashed | Combed | Hypo-Allergic Fabric\nGOTS Organic Cotton Certified',
    images: ['/images/guard-dawgs.jpg', '/images/guard-dawgs.jpg', '/images/guard-dawgs.jpg', '/images/guard-dawgs.jpg'],
  },
  {
    id: '2',
    name: 'SCARS OF MERCY',
    price: '₹1,499',
    tag: 'SELLING FAST',
    category: 'tops',
    description: 'Composition : 220 GSM 100% Heavyweight Cotton\nBlack Colour\nBiowashed | Combed | Hypo-Allergic Fabric\nOversized Fit',
    images: ['/images/scars.jpg', '/images/scars.jpg', '/images/scars.jpg', '/images/scars.jpg'],
  },
  {
    id: '3',
    name: 'SIDHE MAUT STAMP',
    price: '₹1,199',
    tag: '',
    category: 'tops',
    description: 'Composition : 200 GSM 100% Cotton\nBrown Colour\nVintage Wash | Crackle Print\nLimited Edition',
    images: ['/images/sidhe-maut.jpg', '/images/sidhe-maut.jpg', '/images/sidhe-maut.jpg', '/images/sidhe-maut.jpg'],
  },
  {
    id: '4',
    name: 'N.W.A VINTAGE',
    price: '₹1,299',
    tag: 'LIMITED',
    category: 'tops',
    description: 'Composition : 200 GSM 100% Cotton\nBrown Colour\nVintage Acid Wash | High Density Print\nRelaxed Fit',
    images: ['/images/nwa.jpg', '/images/nwa.jpg', '/images/nwa.jpg', '/images/nwa.jpg'],
  },
  {
    id: '5',
    name: 'CAROLINA AFTER PARTY',
    price: '₹1,399',
    tag: '',
    category: 'tops',
    description: 'Composition : 200 GSM 100% Cotton Lycra\nOff-White Colour\nBiowashed | Combed | Hypo-Allergic Fabric\nGraphic Front Print',
    images: ['/images/carolina.jpg', '/images/carolina.jpg', '/images/carolina.jpg', '/images/carolina.jpg'],
  }
]

async function main() {
  console.log('Start seeding...')
  
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        tag: p.tag,
        category: p.category,
        images: {
          create: p.images.map(imgUrl => ({ url: imgUrl }))
        }
      },
    })
    console.log(`Created product with id: ${product.id}`)
  }
  
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
