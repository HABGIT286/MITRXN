import FormData from "form-data";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { name, title, subject, date, changedTitles } = req.body;

  const botToken = process.env.BOT_TOKEN;  // تأكد أنك أضفت هذا في Vercel
  const chatId = process.env.CHAT_ID;      // تأكد أنك أضفت هذا في Vercel

  const content =
`اسم الطالب: ${name}
عنوان التقرير: ${title}
المادة: ${subject}
التاريخ: ${date}
العناوين التي غيرها: ${changedTitles.join(", ")}`;

  // إنشاء FormData جديد لـ Telegram
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("document", Buffer.from(content), { filename: name + ".txt" });

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (!data.ok) throw new Error(JSON.stringify(data));

    res.status(200).json({ ok: true });
  } catch (err) {
    console.log("Telegram send error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
