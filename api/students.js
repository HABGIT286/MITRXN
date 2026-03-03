let students = [];

export default function handler(req, res) {

    if (req.method === "POST") {

        const { name, title, subject } = req.body;

        if (!name || !title || !subject) {
            return res.status(400).json({
                ok: false,
                message: "املأ جميع الحقول"
            });
        }

        // منع تكرار الاسم
        const nameExists = students.find(s => s.name === name);
        if (nameExists) {
            return res.status(400).json({
                ok: false,
                message: "هذا الطالب مسجل مسبقاً"
            });
        }

        // منع تكرار العنوان
        const titleExists = students.find(s => s.title === title);
        if (titleExists) {
            return res.status(400).json({
                ok: false,
                message: "هذا العنوان مستخدم مسبقاً"
            });
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

        return res.status(200).json({
            ok: true,
            students
        });
    }

    if (req.method === "GET") {
        return res.status(200).json({
            ok: true,
            students
        });
    }

    return res.status(405).json({
        ok: false,
        message: "Method not allowed"
    });
}
