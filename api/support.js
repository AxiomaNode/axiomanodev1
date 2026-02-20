import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, message } = req.body || {};
  if (!email || !message) {
    return res.status(400).json({ error: "Missing data" });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      error: "Server env is not configured",
      hasUser: !!process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
      hasTo: !!process.env.EMAIL_TO,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: "Support request",
      text: `From: ${email}\n\nMessage:\n${message}`,
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId || null,
      accepted: info.accepted || [],
      rejected: info.rejected || [],
    });
  } catch (err) {
    return res.status(500).json({
      error: "Email failed",
      details: err?.message || String(err),
      code: err?.code || null,
      response: err?.response || null,
    });
  }
}