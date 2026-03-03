let students = []; // تخزين مؤقت

export default async function handler(req, res) {

    if (req.method === "POST") {

        const { name, title, subject } = req.body;

        if (!name || !title || !subject) {
            return res.status(400).json({ ok:false, message:"بيانات ناقصة" });
        }

        // منع تكرار العنوان
        const titleExists = students.find(s => s.title === title);
        if (titleExists) {
            return res.status(400).json({ ok:false, message:"العنوان مستخدم مسبقاً" });
        }

        // منع تسجيل نفس الطالب مرتين
        const studentExists = students.find(s => s.name === name);
        if (studentExists) {
            return res.status(400).json({ ok:false, message:"هذا الطالب مسجل مسبقاً" });
        }

        const newStudent = {
            name,
            title,
            subject,
            date: new Date().toLocaleString()
        };

        students.push(newStudent);

        // ترتيب حسب الاسم
        students.sort((a,b)=> a.name.localeCompare(b.name,"ar"));

        return res.status(200).json({ ok:true, students });

    }

    if (req.method === "GET") {
        return res.status(200).json({ ok:true, students });
    }

    return res.status(405).json({ ok:false });
}
