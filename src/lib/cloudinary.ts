import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload an image buffer or base64 string to Cloudinary
 * @param fileBuffer - Buffer or data URI base64 string
 * @param folder - Folder path in Cloudinary (e.g. 'cults/products', 'cults/avatars')
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer | string,
  folder: string = 'cults/products'
): Promise<CloudinaryUploadResult> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured in .env');
  }

  return new Promise((resolve, reject) => {
    // If it's a string (e.g. data:image/png;base64,... or remote URL)
    if (typeof fileBuffer === 'string') {
      cloudinary.uploader.upload(
        fileBuffer,
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' } // Automatically serves WebP or AVIF
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload to Cloudinary failed'));
          } else {
            resolve({
              url: result.url,
              secure_url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          }
        }
      );
    } else {
      // If it's a binary Buffer (e.g. from FormData / Next.js Request)
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' } // Auto converts to WebP/AVIF
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload stream to Cloudinary failed'));
          } else {
            resolve({
              url: result.url,
              secure_url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    }
  });
}

/**
 * Delete an image from Cloudinary using its public_id
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === 'ok';
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
    return false;
  }
}

/**
 * Generate a dynamic transformed Cloudinary URL
 * Example: getCloudinaryUrl('cults/products/tee-1', { width: 600, height: 750, crop: 'fill' })
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string }
): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });
}

export default cloudinary;
