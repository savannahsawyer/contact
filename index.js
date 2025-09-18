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
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    console.log("Verifying SMTP credentials...");
    await transporter.verify();            // ✅ Check login before send
    console.log("SMTP login verified ✅");

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
