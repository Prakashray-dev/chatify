// import { resendClient, sender } from "../lib/resend.js";
// import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

// export const sendWelcomeEmail = async (email, name, clientURL) => {
//   const { data, error } = await resendClient.emails.send({
//     from: `${sender.name} <${sender.email}>`,
//     to: email,
//     subject: "Welcome to Chatify!",
//     html: createWelcomeEmailTemplate(name, clientURL),
//   });

//   if (error) {
//     console.error("Error sending welcome email:", error);
//     throw new Error("Failed to send welcome email");
//   }

//   console.log("Welcome Email sent successfully", data);
// };






// src/emails/emailhandler.js
import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  // If you want to force all dev emails to one address, set DEV_TEST_EMAIL in .env
  const devRecipient = process.env.NODE_ENV !== "production" && process.env.DEV_TEST_EMAIL
    ? process.env.DEV_TEST_EMAIL
    : null;

  const recipient = devRecipient || email;

  try {
    const { data, error } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: recipient,
      subject: "Welcome to Chatify!",
      html: createWelcomeEmailTemplate(name, clientURL),
    });

    if (error) {
      // Resend client may return a structured error; throw to be caught below
      throw error;
    }

    console.log("Welcome Email sent successfully", data);
    return data;
  } catch (err) {
    // If we're in production, surface the error so it can be noticed and fixed
    if (process.env.NODE_ENV === "production") {
      console.error("Failed to send welcome email (production) — throwing:", err);
      throw new Error("Failed to send welcome email");
    }

    // In development: log a warning and continue (non-fatal)
    console.warn("Warning: failed to send welcome email (dev, non-fatal):", err?.message || err);
    // Optionally log full error object somewhere for debugging
    return null;
  }
};
