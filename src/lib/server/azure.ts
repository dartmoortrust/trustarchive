import { BlobServiceClient } from "@azure/storage-blob";
import { env } from "$env/dynamic/private";

const blobServiceClient = BlobServiceClient.fromConnectionString(env.BLOB_KEY);
const containerClientMaster = blobServiceClient.getContainerClient("master");
const containerClientWeb = blobServiceClient.getContainerClient("public");

export const keyToBlobUrlWeb = (key: string) => {
  return `${key.slice(0, 2)}/w-${key}`;
};

export const keyToBlobUrlMaster = (key: string) => {
  return `${key.slice(0, 2)}/${key}`;
};

export const blobExistsWeb = async (key: any) => {
  const blobClient = containerClientWeb.getBlobClient(keyToBlobUrlWeb(key));
  return await blobClient.exists();
};

export const blobExistsMaster = async (key: any) => {
  const blobClient = containerClientMaster.getBlobClient(
    keyToBlobUrlMaster(key),
  );
  return await blobClient.exists();
};

export const uploadFileMaster = async (key: string, buffer: Buffer) => {
  const blockBlobClient = containerClientMaster.getBlockBlobClient(
    keyToBlobUrlMaster(key),
  );
  await blockBlobClient.upload(buffer, buffer.length);
};

export const uploadFileWeb = async (key: string, buffer: Buffer) => {
  const blockBlobClient = containerClientWeb.getBlockBlobClient(
    keyToBlobUrlWeb(key),
  );
  await blockBlobClient.upload(buffer, buffer.length);
};
