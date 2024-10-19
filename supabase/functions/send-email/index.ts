import { Webhook, WebhookVerificationError } from 'https://esm.sh/standardwebhooks@1.0.0'
import Mailgun from "https://deno.land/x/mailgun@v1.3.0/index.ts";

const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;
const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY") as string;
const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN") as string;

const mailgun = new Mailgun({
  key: mailgunApiKey,
  domain: mailgunDomain,
  region: "us", // or "eu" depending on your Mailgun account region
});
  
const FROM_EMAIL = 'admin@mg.dmarie.com'
import { emailTemplates } from './templates.ts';

interface WebhookPayload {
  user: {
    email: string;
    user_metadata: { i18n?: string };
  };

  email_data: {
    token?: string;
    token_hash?: string;
    redirect_to?: string;
    email_action_type: string;
    site_url?: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);

    const wh = new Webhook(hookSecret);
    const { user, email_data } = wh.verify(payload, headers) as WebhookPayload;

    const language = user.user_metadata.i18n || 'en';

    const subject = emailTemplates[email_data.email_action_type][language].subject || 'Notification';

    let template = emailTemplates[email_data.email_action_type][language].html;

    if (!template) {
      console.warn(`No template found for type: ${email_data.email_action_type}, lang: ${language}. Falling back to English.`);
      template = emailTemplates[email_data.email_action_type]['en'].html;
    }
    /**
  email_data: {
    token?: string;
    token_hash?: string;
    redirect_to?: string;
    email_action_type: string;
    site_url?: string;
    token_new?: string;
    token_hash_new?: string;
  };
     */

    const confirmationURL = `${email_data.site_url}/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to ||''}`

    let htmlBody = template
      .replace('{{.confirmation_url}}', confirmationURL)
      .replace('{{.ConfirmationURL}}', confirmationURL)
      .replace('{{.token}}', email_data.token || '')
      .replace('{{.token_hash}}', email_data.token_hash || '')
      .replace('{{.token_new}}', email_data.token_new || '')
      .replace('{{.token_hash_new}}', email_data.token_hash_new || '')
      .replace('{{.redirect_to}}', email_data.redirect_to || '')
      .replace('{{.site_url}}', email_data.site_url || '')
      .replace('{{.email_action_type}}', email_data.email_action_type || '')

    try {
      const result = await mailgun.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: subject,
        html: htmlBody,
      });

      return new Response(JSON.stringify({ message: 'Email sent successfully.' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw error; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    if (error instanceof WebhookVerificationError) {
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});