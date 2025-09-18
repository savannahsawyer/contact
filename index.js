import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

app.post("/send", async (req, res) => {
  const { host, port, user, pass, from, to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: Number(port) === 465,
      auth: { user, pass }
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
