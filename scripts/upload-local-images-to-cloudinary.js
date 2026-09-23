require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function migrateImagesToCloudinary() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary environment variables are missing in .env!');
    console.log('Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env first.');
    process.exit(1);
  }

  console.log('🚀 Starting image migration to Cloudinary...');

  const productImages = await prisma.productImage.findMany({
    include: { product: true }
  });

  console.log(`Found ${productImages.length} product images in database.`);

  for (const img of productImages) {
    // Check if image is local (starts with /images/)
    if (img.url.startsWith('/images/')) {
      const localFilePath = path.join(__dirname, '..', 'public', img.url);

      if (fs.existsSync(localFilePath)) {
        console.log(`Uploading ${img.url} for product "${img.product?.name}"...`);

        try {
          const result = await cloudinary.uploader.upload(localFilePath, {
            folder: 'cults/products',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ],
          });

          // Update database with secure Cloudinary URL
          await prisma.productImage.update({
            where: { id: img.id },
            data: { url: result.secure_url }
          });

          console.log(`✅ Updated ${img.id}: ${result.secure_url}`);
        } catch (err) {
          console.error(`Failed to upload ${localFilePath}:`, err.message);
        }
      } else {
        console.warn(`File not found: ${localFilePath}`);
      }
    } else {
      console.log(`Skipping already remote URL: ${img.url}`);
    }
  }

  console.log('🎉 Migration completed successfully!');
}

migrateImagesToCloudinary()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
