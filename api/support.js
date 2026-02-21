import nodemailer from "nodemailer";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; 
const RATE_LIMIT_MAX = 3; 

const hits = new Map();

function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function rateLimit(ip) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) return { ok: false, remaining: 0 };

  entry.count += 1;
  hits.set(ip, entry);
  return { ok: true, remaining: RATE_LIMIT_MAX - entry.count };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, message, website, ts } = req.body || {};

  if (website && String(website).trim().length > 0) {
    return res.status(200).json({ success: true });
  }

  const now = Date.now();
  const sentAt = Number(ts);
  if (!Number.isFinite(sentAt) || now - sentAt < 3000) {
    return res.status(429).json({ error: "Too fast. Please try again." });
  }

  if (!email || !message) {
    return res.status(400).json({ error: "Missing data" });
  }

  const msg = String(message).trim();
  if (msg.length < 10) {
    return res.status(400).json({ error: "Message is too short" });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ error: "Server env is not configured" });
  }

  const ip = getClientIp(req);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return res.status(429).json({ error: "Too many requests. Try again later." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `Support request from ${email}`,
      text: `From: ${email}\nIP: ${ip}\n\nMessage:\n${msg}`,
    });

    return res.status(200).json({ success: true, remaining: rl.remaining });
  } catch (err) {
    return res.status(500).json({
      error: "Email failed",
      details: err?.message || String(err),
    });
  }
}