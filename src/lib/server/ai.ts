import { GoogleGenAI } from "@google/genai";
import { db, getSingleRecordById } from "./db";
import { fileIdToBlobUrl } from "$lib/tools";
import { dev } from "$app/environment";
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDk8jxaxPocILK6t-_vSsrPMTz4GWlheCI",
});
export const describeImageById = async (id: string) => {
  if (dev) {
    const record = await getSingleRecordById(id);

    const imageUrl = `https://dartmoor.uksouth.cloudapp.azure.com/image/_/rs:fill:1000/plain/${fileIdToBlobUrl(record.id)}`;

    const response = await fetch(imageUrl);
    const imageArrayBuffer = await response.arrayBuffer();
    const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64ImageData,
          },
        },
        {
          text: `This image was probably taken on or around Dartmoor - certainly in the UK. Describe what you can see in a couple of paragraphs and use any text on the image to help you. Avoid any emotive words and remain factual. This is some information that may help - ${record.detail} - ${record.title}. The text you create is for This is for a website that preserves historic pictures for educational purposes - if you think you know what the picture shows can you provide a little background for the subject identified. If it possible to give an OS Grid Reference of the location featured, please put this at the bottom.`,
        },
      ],
    });
    if (result.text) {
      await db.query(`update files set ai_markdown = $1 where id = $2`, [
        result.text,
        id,
      ]);
    }
  }
};
