
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { name, title, subject, date, changedTitles } = req.body;

  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  const content =
`اسم الطالب: ${name}
عنوان التقرير: ${title}
المادة: ${subject}
التاريخ: ${date}
العناوين التي غيرها: ${changedTitles.join(", ")}`;

  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("document", new Blob([content]), name + ".txt");

  await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
    method: "POST",
    body: formData
  });

  res.status(200).json({ ok: true });
}
