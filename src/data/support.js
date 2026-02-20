import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/support", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "axiomandnode@gmail.com",
      },
    });

    await transporter.sendMail({
      from: email,
      to: "axiomandnode@gmail.com",
      subject: "New Support Request",
      text: `
From: ${email}

Message:
${message}
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});