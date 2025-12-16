import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { env } from "$env/dynamic/private";

let blobServiceClient: BlobServiceClient | null = null;
let containerClientMaster: ContainerClient | null = null;
let containerClientWeb: ContainerClient | null = null;

const initClients = () => {
  if (!blobServiceClient) {
    if (!env.BLOB_KEY) {
      throw new Error("BLOB_KEY environment variable is not set");
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(env.BLOB_KEY);
    containerClientMaster = blobServiceClient.getContainerClient("master");
    containerClientWeb = blobServiceClient.getContainerClient("public");
  }
};

const getMasterClient = () => {
  initClients();
  return containerClientMaster!;
};

const getWebClient = () => {
  initClients();
  return containerClientWeb!;
};

export const keyToBlobUrlWeb = (key: string) => {
  return `${key.slice(0, 2)}/w-${key}`;
};

export const keyToBlobUrlMaster = (key: string) => {
  return `${key.slice(0, 2)}/${key}`;
};

export const blobExistsWeb = async (key: any) => {
  const blobClient = getWebClient().getBlobClient(keyToBlobUrlWeb(key));
  return await blobClient.exists();
};

export const blobExistsMaster = async (key: any) => {
  const blobClient = getMasterClient().getBlobClient(keyToBlobUrlMaster(key));
  return await blobClient.exists();
};

export const uploadFileMaster = async (key: string, buffer: Buffer) => {
  const blockBlobClient = getMasterClient().getBlockBlobClient(
    keyToBlobUrlMaster(key),
  );
  await blockBlobClient.upload(buffer, buffer.length);
};

export const uploadFileWeb = async (key: string, buffer: Buffer) => {
  const blockBlobClient = getWebClient().getBlockBlobClient(
    keyToBlobUrlWeb(key),
  );
  await blockBlobClient.upload(buffer, buffer.length);
};
