// import { Resend } from "resend";
// import { ENV } from "./env.js";

// export const resendClient = new Resend(ENV.RESEND_API_KEY);

// export const sender = {
//   email: ENV.EMAIL_FROM,
//   name: ENV.EMAIL_FROM_NAME,
// };



// resend.js

import "dotenv/config";  // <-- IMPORTANT (loads .env before ENV is read)
import { Resend } from "resend";
import { ENV } from "./env.js";

if (!ENV.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY missing. Add it to your .env file.");
}

export const resendClient = new Resend(ENV.RESEND_API_KEY);

export const sender = {
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};
