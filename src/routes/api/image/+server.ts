import { error, type RequestHandler } from "@sveltejs/kit";
import sharp from "sharp";

export const GET: RequestHandler = async ({ url, fetch }) => {
  const src = url.searchParams.get("url");
  if (!src) throw error(400, 'Missing "url" parameter');

  // 1. Validation & Constants
  const size = Math.min(
    Math.max(Number(url.searchParams.get("s")) || 500, 1),
    2000,
  ); // Sanitize/Limit size
  const quality = Number(url.searchParams.get("q")) || 80;
  const rotate = Number(url.searchParams.get("r")) || 0;
  const crop = url.searchParams.get("c") === "true";

  try {
    const srcUrl = new URL(src);
    // if (srcUrl.hostname !== "dartmoor.blob.core.windows.net") {
    //   throw error(403, "Domain not allowed");
    // }

    // 2. Optimized Fetch
    const response = await fetch(src);
    if (!response.ok) throw error(404, "Image not found");

    // Bun's fetch returns a Response where .arrayBuffer()
    // is highly optimized. We use Uint8Array directly.
    const inputData = new Uint8Array(await response.arrayBuffer());

    // 3. Sharp Pipeline
    let pipeline = sharp(inputData).resize({
      width: size,
      height: size,
      fit: crop ? "cover" : "inside",
      withoutEnlargement: true,
    });

    // Conditional transformations
    if (rotate !== 0) pipeline = pipeline.rotate(rotate);
    if (url.searchParams.get("n") === "true") pipeline = pipeline.negate();
    if (url.searchParams.get("flip") === "true") pipeline = pipeline.flip();
    if (url.searchParams.get("flop") === "true") pipeline = pipeline.flop();

    // 4. Output as WebP (Stream or Buffer)
    const result = await pipeline.webp({ quality }).toBuffer();

    return new Response(new Uint8Array(result), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": result.length.toString(),
      },
    });
  } catch (err) {
    if ((err as any).status) throw err; // Re-throw SvelteKit errors
    console.error("Image processing error:", err);
    throw error(500, "Error processing image");
  }
};
