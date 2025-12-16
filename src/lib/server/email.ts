import { env } from "$env/dynamic/private";
import { EmailClient } from "@azure/communication-email";

export const sendEmail = async (email: string, body: string) => {
  console.log("sending email");

  // Initialize client inside the function
  const client = new EmailClient(env.AZURE_EMAIL);

  const message = {
    senderAddress:
      "DoNotReply@fc61af18-08ac-4ac1-8df4-c81ca3514d48.azurecomm.net",
    content: {
      subject: "Dartmoor Trust Login",
      plainText: body,
    },
    recipients: {
      to: [
        {
          address: email,
          displayName: "Dartmoor Trust User",
        },
      ],
    },
  };

  const poller = await client.beginSend(message);
  const response = await poller.pollUntilDone();
  console.log(response);
};
