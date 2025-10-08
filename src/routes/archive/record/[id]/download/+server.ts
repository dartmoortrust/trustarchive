import { db } from "$lib/server/db";
import { getSignedUrl } from "$lib/server/files";

import { json, redirect } from "@sveltejs/kit";

export async function GET({ params, request, locals }) {
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
    const signedUrl = await getSignedUrl(
      record.rows[0].file_id,
      `${record.rows[0].id}.${record.rows[0].file_mime.split("/")[1]}`,
    );
    redirect(302, signedUrl);
  }

  return json("This file is not allowed");
}
