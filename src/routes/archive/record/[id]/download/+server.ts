import { env } from "$env/dynamic/private";
import { db } from "$lib/server/db";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Import getSignedUrl
import { redirect } from "@sveltejs/kit";

import { json } from "@sveltejs/kit";
// Initialize S3 client
const s3Client = new S3Client({
  region: "eu-west-1", // Replace with your region
  credentials: {
    accessKeyId: env.ACCESS_KEY,
    secretAccessKey: env.SECRET_KEY,
  },
});

export async function GET({ params, request, locals }) {
  const bucketName = "dartmoormaster"; // Your S3 bucket name
  const recordId = Number(params.id);
  if (!recordId) {
    return json("File ID parameter is required");
  }
  let record = await db.query(
    "select id, file_id, file_mime, downloadable from records where id = $1",
    [recordId],
  );
  const isAuthenticated = locals.session?.roles?.includes("file-download");
  console.log(isAuthenticated);

  if (isAuthenticated || record.rows[0].downloadable) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: record.rows[0].file_id,
      ResponseContentDisposition: `attachment; filename="${recordId}.${record.rows[0].file_mime.split("/")[1]}"`, // Set the filename here
    });

    // Set the expiration time for the URL (in seconds)
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    redirect(302, signedUrl);
  }

  return json("This file is not allowed");
}
