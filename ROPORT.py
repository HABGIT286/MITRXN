import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
import json, os
from datetime import datetime

BOT_TOKEN = "7769329974:AAHEwfIzPDZ1-KCSAKsxepmNtC35lYXvlMs"
bot = telebot.TeleBot(BOT_TOKEN)

DATA_FILE = "reports.json"

# تحميل البيانات
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        reports = json.load(f)
else:
    reports = {}

user_state = {}

def save_data():
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(reports, f, ensure_ascii=False, indent=2)

def main_menu(chat_id):
    markup = InlineKeyboardMarkup()
    markup.add(InlineKeyboardButton("➕ إضافة عنوان تقرير", callback_data="add"))
    markup.add(InlineKeyboardButton("📌 عرض اسم تقريري", callback_data="show_mine"))
    markup.add(InlineKeyboardButton("🗑️ حذف عنوان تقريري", callback_data="delete"))
    markup.add(InlineKeyboardButton("📚 عرض جميع التقارير", callback_data="list_all"))
    bot.send_message(chat_id, "👋 اختر ما تريد:", reply_markup=markup)

@bot.message_handler(commands=["start"])
def start(message):
    main_menu(message.chat.id)

@bot.callback_query_handler(func=lambda call: True)
def menu_actions(call):
    user_id = str(call.from_user.id)

    # 1) إضافة عنوان
    if call.data == "add":
        if user_id in reports:
            bot.answer_callback_query(call.id, "⚠️ لديك عنوان مسجل. احذف القديم أولاً.", show_alert=True)
        else:
            user_state[user_id] = "awaiting_name"
            bot.send_message(call.message.chat.id, "📝 أرسل اسمك الآن:")

    # 2) عرض عنواني
    elif call.data == "show_mine":
        if user_id not in reports:
            bot.answer_callback_query(call.id, "⚠️ لا يوجد عنوان مسجل لك.", show_alert=True)
        else:
            data = reports[user_id]
            bot.send_message(call.message.chat.id, f"🎓 اسمك: {data['name']}\n📌 عنوان تقريرك: {data['topic']}\n⏱ وقت التسجيل: {data['time']}")

    # 3) حذف عنوان
    elif call.data == "delete":
        if user_id not in reports:
            bot.answer_callback_query(call.id, "⚠️ لا يوجد عنوان لتحذفه.", show_alert=True)
        else:
            reports.pop(user_id)
            save_data()
            bot.send_message(call.message.chat.id, "🗑️ تم حذف عنوانك بنجاح.\nيمكنك الآن إضافة عنوان جديد.")
#FDN00
#MOTRXVIP
    # 4) عرض الكل
    elif call.data == "list_all":
        if not reports:
            bot.send_message(call.message.chat.id, "لا توجد تقارير مسجلة.")
        else:
            text = "📚 قائمة تقارير الطلاب:\n\n"
            for uid, data in reports.items():
                text += f"👤 {data['name']}\n📌 {data['topic']}\n⏱ {data['time']}\n———————\n"
            bot.send_message(call.message.chat.id, text)

@bot.message_handler(func=lambda message: True)
def handle_messages(message):
    user_id = str(message.from_user.id)

    # الخطوة 1: إدخال الاسم
    if user_id in user_state and user_state[user_id] == "awaiting_name":
        user_state[user_id] = {"name": message.text}
        bot.send_message(message.chat.id, "✍️ الآن أرسل عنوان تقريرك:")

    # الخطوة 2: إدخال العنوان
    elif user_id in user_state and isinstance(user_state[user_id], dict):
        topic = message.text

        # منع تكرار الموضوع بين الطلاب
        for data in reports.values():
            if data["topic"] == topic:
                bot.send_message(message.chat.id, "⚠️ هذا العنوان مستخدم من طالب آخر. اختر عنوان مختلف.")
                return

        student_name = user_state[user_id]["name"]
        timestamp = datetime.now().strftime("%Y/%m/%d - %I:%M:%S %p")

        reports[user_id] = {"name": student_name, "topic": topic, "time": timestamp}
        save_data()
        user_state.pop(user_id)

        bot.send_message(message.chat.id, "✅ تم تسجيل عنوانك بنجاح.")
        main_menu(message.chat.id)

print("✅ Bot is Running...")

while True:
    try:
        bot.infinity_polling(timeout=10, long_polling_timeout=5)
    except Exception as e:
        print("⚠️ تم فقدان الاتصال وسيتم إعادة المحاولة...", e)