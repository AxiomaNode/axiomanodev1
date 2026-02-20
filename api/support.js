import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Разрешим только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, message } = req.body || {};

  if (!email || !message) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: "Server env is not configured" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Быстрая проверка логина/пароля
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,     // отправитель — твой Gmail
      replyTo: email,                   // а отвечать можно пользователю
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: "Support request",
      text: `From: ${email}\n\nMessage:\n${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({
      error: "Email failed",
      details: err?.message || String(err),
    });
  }
}