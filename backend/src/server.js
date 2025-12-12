import 'dotenv/config'; 

import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";


import { Resend } from "resend";

// Defensive check for RESEND
if (!process.env.RESEND_API_KEY) {
  console.error(
    "ERROR: RESEND_API_KEY is not set. Add it to your .env file or environment variables.\n" +
    "Example .env:\nRESEND_API_KEY=re_XXXXXXXXXXXXXXXX\n"
  );
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT || ENV.PORT || 3000;

// middlewares & config
app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


if (process.env.NODE_ENV === "production" || ENV.NODE_ENV === "production") {
 
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// start server and connect DB
server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB().catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
});
