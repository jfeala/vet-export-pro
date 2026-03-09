import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./ses-client";

const FROM_EMAIL = process.env.SES_FROM_EMAIL || "hello@vetexportpro.com";

export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string
): Promise<void> {
  const command = new SendEmailCommand({
    Source: `VetExport Pro <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Html: { Data: htmlBody, Charset: "UTF-8" },
      },
    },
  });

  await sesClient.send(command);
}
