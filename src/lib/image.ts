import type { Record } from "$lib/schema";

const imageRoot = "https://dartmoortrust.org/api/image/";
const blobRoot = "https://dartmoor.blob.core.windows.net/public/";

const keyToBlobUrl = (key: string, prefix: string = "w") => {
  return `${key.slice(0, 2)}/${prefix}-${key}`;
};

export const getRecordImageWebUrl = (
  record: Record,
  size: number,
  crop: boolean,
) => {
  if (record.medium === "video") {
    return `${imageRoot}?url=${blobRoot + keyToBlobUrl(record.sha1_hash, "s")}&s=${size}&c=${crop}`;
  } else if (record.medium === "audio") {
    return `${imageRoot}url=${blobRoot}`;
  } else {
    return `${imageRoot}?url=${blobRoot + keyToBlobUrl(record.sha1_hash)}&s=${size}&c=${crop}`;
  }
};
