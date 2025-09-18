import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

app.post("/send", async (req, res) => {
  const { from, to, subject, text } = req.body;

  console.log("Starting to send email...");

  try {
    const transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465,
      auth: { user: USER, pass: PASS },
      connectionTimeout: 10000, // 10s
      greetingTimeout: 10000,   // 10s
      socketTimeout: 10000      // 10s
    });

    console.log("Connecting to SMTP:", HOST, PORT);

    await transporter.verify();
    console.log("SMTP connection verified ✅");

    await transporter.sendMail({ from, to, subject, text });
    console.log("Email sent ✅");

    res.json({ ok: true });
  } catch (err) {
    console.error("SMTP send error ❌", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const portNumber = process.env.PORT || 3000;
app.listen(portNumber, () => {
  console.log(`SMTP bridge running on port ${portNumber}`);
});
