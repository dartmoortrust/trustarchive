// src/routes/images/[encodedImagePath]/[transformations].js
import { error } from "@sveltejs/kit"; // Use error for better HTTP responses
import sharp from "sharp";

export async function GET({ params }) {
  const { encodedImagePath, transformations } = params;

  if (!encodedImagePath) {
    throw error(400, "Missing Image URL"); // Throw HTTP error
  }
  if (!transformations) {
    throw error(400, "Missing Transformation Options"); // Throw HTTP error
  }

  try {
    const imagePath = decodeURIComponent(encodedImagePath);

    // Fetch the image with better error handling:
    const response = await fetch(imagePath);
    if (!response.ok) {
      const errorText = await response.text(); // Try to get error details from the server
      throw error(
        response.status,
        `Failed to fetch image: ${response.status} ${response.statusText} - ${errorText || "No details"}`,
      );
    }
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    const transformationOptions = parseTransformations(transformations);
    console.log(transformationOptions);
    // Use a try...catch for Sharp processing:
    try {
      let transformer = sharp(imageBuffer); // No need for Buffer.from again
      for (const [key, value] of Object.entries(transformationOptions)) {
        switch (key) {
          case "w":
            transformer.resize({ width: parseInt(value) });
            break;
          case "h":
            transformer.resize({ height: parseInt(value) });
            break;
          case "x":
            transformer.flop();
            break;
          case "y":
            transformer.flip();
            break;
          case "n":
            transformer.negate();
            break;
          // case "f":
          //   transformer.toFormat(value);
          //   break;
          case "q":
            transformer.jpeg({ quality: parseInt(value) });
            break;
          case "r":
            transformer.rotate(parseInt(value));
            break;
        }
      }
      const processedImageBuffer = await transformer.toBuffer();

      const contentType = `image/${transformationOptions.f || "jpeg"}`;
      return new Response(processedImageBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch (sharpError) {
      console.error("Sharp processing error:", sharpError);
      throw error(500, `Image processing failed: ${sharpError.message}`); // More specific error
    }
  } catch (err) {
    // This now catches both fetch and Sharp errors
    console.error("Error in image API:", err); // Log the full error for debugging
    if (err instanceof Error && err.status) {
      // Check if it's an HTTP error
      throw err; // Re-throw the HTTP error so SvelteKit can handle it
    } else {
      throw error(500, "An unexpected error occurred."); // Generic error for other cases
    }
  }
}

function parseTransformations(transformationsString) {
  const options = {};
  if (transformationsString) {
    transformationsString.split(",").forEach((part) => {
      const [key, value] = part.split("_");
      options[key] = value;
    });
  }
  return options;
}
