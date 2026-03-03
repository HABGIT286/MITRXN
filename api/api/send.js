export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    try {
        const { name, title, subject, date, changedTitles } = req.body;

        if (!name || !title || !subject) {
            return res.status(400).json({ ok: false, error: "Missing fields" });
        }

        const textMessage =
`📚 تقرير طالب جديد

👤 الاسم: ${name}
📝 عنوان التقرير: ${title}
📖 المادة: ${subject}
📅 التاريخ: ${date}
🔁 العناوين التي غيّرها: ${(changedTitles && changedTitles.length > 0) ? changedTitles.join(", ") : "لا يوجد"}`;

        const BOT_TOKEN = process.env.BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: textMessage
                })
            }
        );

        const telegramResult = await telegramResponse.json();

        if (!telegramResult.ok) {
            return res.status(500).json({ ok: false, error: telegramResult });
        }

        return res.status(200).json({ ok: true });

    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
}
