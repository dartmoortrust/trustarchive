import { env } from "$env/dynamic/private";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Configure the AWS region
const sesClient = new SESClient({
  region: "eu-west-1",
  credentials: {
    accessKeyId: env.ACCESS_KEY,
    secretAccessKey: env.SECRET_KEY,
  },
});

// Function to send an email
export const sendEmail = async (email: string, message: string) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: message,
        },
        Html: {
          Data: message,
        },
      },
      Subject: {
        Data: "Dartmoor Trust - Password reset",
      },
    },
    Source: "noreply@dartmoortrust.org", // Replace with your verified sender email address
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
  } catch (error) {}
};

// Call the function
