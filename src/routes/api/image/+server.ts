import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import { json, type RequestEvent } from "@sveltejs/kit";

const IMAGES_DIR = path.resolve("static/images");


// export async function POST({ request }: RequestEvent) {
//   try {
//     const { imageUrl, transform } = await request.json();
//     if (!imageUrl) {
//       return json({ error: "Missing Image URL" }, { status: 400 });
//     }
    
//     let imageBuffer: Buffer;

//     const response = await fetch(imageUrl);

//     if (!response.ok) {
//       return json({ error: "Failed to fetch the image" }, { status: 400 });
//     }

//     imageBuffer = Buffer.from(await response.arrayBuffer());

//     const resizedBuffer = await sharp(imageBuffer)
//       .rotate(transform.rotate)
//       .toBuffer();

//     return new Response(resizedBuffer, {
//       headers: {
//         "Content-Type": "image/jpeg",
//         "Cache-Control": "public, max-age=31536000",
//       },
//     });
//   } catch (e) {
//     console.error(e);
//   }
// }

export async function GET({ url }: RequestEvent) {
  try {
    const imageUrl = url.searchParams.get("url");
    const crop = url.searchParams.get("crop") === "true" || false;
    const cache = url.searchParams.get("cache") === "true" || false;
    const size = parseInt(url.searchParams.get("size") ?? "300", 10) || 300;
    const r = parseInt(url.searchParams.get("r") ?? "0", 10) || 0;
    const negate = url.searchParams.get("negate") === "true" || false;
    const flip = url.searchParams.get("flip") === "true" || false;
    const flop = url.searchParams.get("flop") === "true" || false;
    if (!imageUrl) {
      return new Response("Missing image URL", { status: 400 });
    }
    
    let imageBuffer: Buffer;

    if (imageUrl.startsWith("http")) {
      // Fetch remote image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return new Response("Failed to fetch image", { status: 500 });
      }
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      // Handle local image
      const localPath = path.join(IMAGES_DIR, imageUrl);
      try {
        imageBuffer = await fs.readFile(localPath);
      } catch {
        return new Response("Local image not found", { status: 404 });
      }
    }

    // Resize Image
    const resizedBuffer = await sharp(imageBuffer)
      .resize(size, crop ? size : null, { fit: crop ? "cover" : "inside" })
      .rotate(r)
      .negate(negate)
      .flip(flip)
      .flop(flop)
      .webp()
      .toBuffer();

    return new Response(resizedBuffer, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
