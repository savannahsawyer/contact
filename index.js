import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/send", async (req, res) => {
  const { from, to, subject, text } = req.body;

  if (!from || !to || !subject || !text) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
          },
        ],
        from: { email: from },
        subject: subject,
        content: [
          {
            type: "text/plain",
            value: text,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("SendGrid API Error:", errText);
      return res.status(500).json({ ok: false, error: errText });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`SendGrid bridge running on port ${port}`));
