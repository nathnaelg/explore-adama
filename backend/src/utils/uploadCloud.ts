import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.ts";

if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
  console.error("[Cloudinary] Missing configuration variables!");
} else {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log(`[Cloudinary] Configured for cloud: ${env.CLOUDINARY_CLOUD_NAME}`);
}

export { cloudinary };
