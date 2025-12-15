import { env } from "$env/dynamic/private";
import { EmailClient } from "@azure/communication-email";
const connectionString = env.AZURE_EMAIL;
const client = new EmailClient(connectionString);

export const sendEmail = async (email: string, body: string) => {
  console.log("sending email");
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
