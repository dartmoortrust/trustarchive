import { env } from "$env/dynamic/private";

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";

const accountName = "dartmoor";
const accountKey = env.AZURE_KEY;

export const keyToBlobName = (key: string) => {
  return `${key.slice(0, 2)}/${key}`;
};

export const getSignedUrl = async (key: string, filename: string) => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey,
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential,
  );

  const containerClient = blobServiceClient.getContainerClient("master");
  const blobClient = containerClient.getBlobClient(keyToBlobName(key));
  const downloadFileName = `${key}`; // You can customize the file name here
  // Set expiration time and permissions
  const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour from now
  const sasOptions = {
    containerName: "master",
    blobName: keyToBlobName(key),
    permissions: BlobSASPermissions.parse("r"), // "r" = read access
    expiresOn,
    contentDisposition: `attachment; filename="${filename}"`, // 👈 Set file name
  };

  // Generate SAS token
  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    sharedKeyCredential,
  ).toString();

  // Construct full URL
  const sasUrl = `${blobClient.url}?${sasToken}`;
  return sasUrl;
};
