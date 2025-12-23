import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import sharp from "sharp";

export const GET: RequestHandler = async ({ url, fetch }) => {
  // 1. Get query parameters
  const src = url.searchParams.get("url");
  const size = Number(url.searchParams.get("s")) || 500;
  const quality = Number(url.searchParams.get("q")) || 80;
  const rotate = Number(url.searchParams.get("r")) || 0;
  const crop = url.searchParams.get("c") === "true";
  const negate = url.searchParams.get("n") === "true";
  const flip = url.searchParams.get("flip") === "true";
  const flop = url.searchParams.get("flop") === "true";

  if (!src) {
    throw error(400, 'Missing "url" parameter');
  }

  try {
    const allowedDomains = ["dartmoor.blob.core.windows.net"];
    const srcUrl = new URL(src);
    if (!allowedDomains.includes(srcUrl.hostname)) {
      throw error(403, "Domain not allowed");
    }
    const response = await fetch(src);

    if (!response.ok) {
      throw error(404, "Image not found");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const processedImage = sharp(buffer).resize({
        width: size,
        height: size,
        fit: crop ? "cover" : "inside",
        withoutEnlargement: true,
      })
      
    if(rotate !== 0){
      processedImage.rotate(rotate)
    }  
    if(negate){
      processedImage.negate(negate)
    } 
    if(flip){
      processedImage.flip(flip)
    }
    if(flop){
      processedImage.flop(flop)
    } 
    await processedImage.webp({ quality: quality }).toBuffer();

    // 5. Return the response
    return new Response(processedImage, {
      headers: {
        "Content-Type": "image/webp",
        // Cache for 1 year (immutable) - adjust as needed
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Image processing error:", err);
    throw error(500, "Error processing image");
  }
};
