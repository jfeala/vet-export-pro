import { COUNTRIES_EU } from "@/lib/certificates/en-es-2019-1293/constants";

interface WelcomeEmailParams {
  name: string;
  destination?: string;
}

export function welcomeEmailSubject(): string {
  return "Welcome to VetExport Pro — Let's get your pet travel paperwork sorted";
}

export function welcomeEmailHtml({ name, destination }: WelcomeEmailParams): string {
  const countryName = destination
    ? COUNTRIES_EU.find((c) => c.code === destination)?.name
    : null;

  const destinationSection = countryName
    ? `<p style="margin: 0 0 16px; color: #1a1a2e; font-size: 15px; line-height: 1.6;">
        You mentioned you're planning to travel to <strong>${countryName}</strong>.
        Great news — our EU pet travel certificate (EN-ES 2019-1293) covers ${countryName},
        and the form will automatically apply all country-specific requirements for you.
      </p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f4f7f5; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e8ede8;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1a3c34, #2d6a4f, #40916c); padding: 32px 32px 24px;">
        <div style="font-size: 28px; margin-bottom: 8px;">&#x1F43E;</div>
        <h1 style="margin: 0; color: white; font-size: 22px; font-weight: 700;">
          Welcome to VetExport Pro
        </h1>
      </div>

      <!-- Body -->
      <div style="padding: 32px;">
        <p style="margin: 0 0 16px; color: #1a1a2e; font-size: 15px; line-height: 1.6;">
          Hi ${name},
        </p>
        <p style="margin: 0 0 16px; color: #1a1a2e; font-size: 15px; line-height: 1.6;">
          Thanks for signing up! VetExport Pro helps you fill out USDA APHIS
          international health certificates for pet travel to Europe — correctly,
          the first time.
        </p>
        ${destinationSection}
        <p style="margin: 0 0 24px; color: #1a1a2e; font-size: 15px; line-height: 1.6;">
          When you're ready, our step-by-step wizard will walk you through every
          field on the certificate, apply all the regulatory rules automatically,
          and generate a print-ready PDF for your vet to sign.
        </p>

        <!-- CTA -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://vetexportpro.com/certificate"
             style="display: inline-block; padding: 14px 32px; background-color: #2d6a4f; color: white; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 10px;">
            Start Your Certificate &rarr;
          </a>
        </div>

        <p style="margin: 0 0 8px; color: #6b7c93; font-size: 13px; line-height: 1.5;">
          Questions? Reply to this email or reach us at:
        </p>
        <p style="margin: 0; color: #6b7c93; font-size: 13px;">
          jake@vetexportpro.com &middot; lauren@vetexportpro.com
        </p>
      </div>

      <!-- Footer -->
      <div style="padding: 20px 32px; background-color: #f4f7f5; border-top: 1px solid #e8ede8;">
        <p style="margin: 0; color: #6b7c93; font-size: 11px; line-height: 1.5;">
          VetExport Pro is not affiliated with USDA APHIS. Always verify certificate
          requirements with your local APHIS Veterinary Services office before travel.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
