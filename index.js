import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

// Pull them from environment just once
const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

app.get("/", (req, res) => {
  res.json({
    host: HOST,
    port: PORT,
    user: USER ? "(set)" : "(missing)",
    pass: PASS ? "(set)" : "(missing)"
  });
});

app.post("/send", async (req, res) => {
  const { from, to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465,
      auth: { user: USER, pass: PASS },
    });

    await transporter.sendMail({ from, to, subject, text });

    res.json({ ok: true });
  } catch (err) {
    console.error("SMTP send error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const portNumber = process.env.PORT || 3000;
app.listen(portNumber, () => {
  console.log(`SMTP bridge running on port ${portNumber}`);
});
