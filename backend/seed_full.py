"""
HotelPro - Demo Data Seed Script
Clears all tables and populates with rich demo data.
"""
import sqlite3
import os
import sys

if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

DB_PATH = os.path.join(os.path.dirname(__file__), 'hotel.db')

IMAGES = {
    'lobby': '/images/hotel-lobby.jpg_1776122885.png',
    'exterior': '/images/hotel-exterior.jpg_1776122910.png',
    'room': '/images/hotel-room.jpg_1776122934.png',
    'restaurant': '/images/hotel-restaurant.jpg_1776122959.png',
    'pool': '/images/hotel-pool.jpg_1776122998.png',
    'spa': '/images/hotel-spa.jpg_1776123020.png',
    'conference': '/images/hotel-conference.jpg_1776123043.png',
    'gym': '/images/hotel-gym.jpg_1776123066.png',
    'ceo': '/images/ceo-portrait.jpg_1776123104.png',
    'manager': '/images/manager-portrait.jpg_1776123127.png',
    'director': '/images/director-portrait.jpg_1776123156.png',
}


def clear_all_tables(conn):
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = OFF")
    tables = ['settings', 'timelines', 'faqs', 'blogs', 'partners',
              'testimonials', 'team_members', 'stats', 'applications',
              'projects', 'categories', 'services', 'admins']
    for table in tables:
        cursor.execute(f"DELETE FROM {table}")
    cursor.execute("PRAGMA foreign_keys = ON")
    conn.commit()
    print("[OK] All tables cleared")


def seed_categories(conn):
    cursor = conn.cursor()
    data = [
        ('Hotel Management', 'Mehmonxona Boshqaruvi', 'hotel-management'),
        ('Pre-Opening', 'Pre-Opening', 'pre-opening'),
        ('Consulting', 'Konsalting', 'consulting'),
        ('Renovation', 'Renovatsiya', 'renovation'),
        ('Staff Training', 'Xodimlar Tarkibiyish', 'staff-training'),
    ]
    cursor.executemany("INSERT INTO categories (name_en, name_ru, slug) VALUES (?, ?, ?)", data)
    conn.commit()
    print(f"[OK] {len(data)} categories added")


def seed_services(conn):
    cursor = conn.cursor()
    data = [
        ('Full Hotel Management', "To'liq Mehmonxona Boshqaruvi",
         'Comprehensive day-to-day hotel operations including front desk, housekeeping, food & beverage, and maintenance.',
         'Kun tartibida barcha mehmonxona operatsiyalarini boshqarish: resepshn, xona xizmati, oshpazlik va texnik xizmat.',
         'fa-hotel', IMAGES['lobby'], 1),
        ('Pre-Opening Services', 'Pre-Opening Xizmatlari',
         'Complete hotel setup before grand opening: staff recruitment, SOP development, vendor selection.',
         'Grand openinggacha to\'liq mehmonxona tayyorlash: xodim yollash, SOP ishlab chiqish, ta\'minotchilar tanlash.',
         'fa-rocket', IMAGES['exterior'], 1),
        ('Revenue Management', 'Daromadni Boshqarish',
         'Maximize your hotel revenue through dynamic pricing, distribution optimization, and yield management.',
         'Dinamik narxlash, distribyutsiya kanallarini optimallashtirish va yield management orqali daromadingizni oshiring.',
         'fa-chart-line', IMAGES['room'], 1),
        ('F&B Consulting', 'F&B Konsalting',
         'Food & Beverage concept development, menu engineering, kitchen design.',
         'Ovqatlanish konsepsiyasini ishlab chiqish, menyu muhandisligi, oshxona loyihalash.',
         'fa-utensils', IMAGES['restaurant'], 0),
        ('Spa & Wellness', 'Spa va Wellness',
         'Complete spa facility setup including treatment protocols and wellness program development.',
         'Davolash protokollari va wellness dasturini ishlab chiqish bilan spaga qurilma o\'rnatish.',
         'fa-spa', IMAGES['spa'], 0),
        ('Sales & Marketing', 'Sotuv va Marketing',
         'Comprehensive marketing strategy, digital presence, corporate sales, and MICE coordination.',
         'Keng qamrovli marketing strategiyasi, raqamli mavjudlik, korporativ sotuvlar va MICE muvofiqlashtirish.',
         'fa-bullhorn', IMAGES['pool'], 1),
        ('Technical Services', 'Texnik Xizmatlar',
         'Hotel engineering maintenance, MEP systems, renovation management.',
         'Mexmonxona injiniring xizmatlari, MEP tizimlari, renovatsiya boshqaruvi.',
         'fa-tools', IMAGES['conference'], 0),
        ('Staff Training', 'Xodimlar Tarkibiyish',
         'Professional training programs for hotel staff at all levels.',
         'Barcha darajadagi mehmonxona xodimlari uchun kasbiy tayyorgarlik dasturlari.',
         'fa-user-graduate', IMAGES['gym'], 0),
    ]
    cursor.executemany(
        "INSERT INTO services (title_en, title_ru, desc_en, desc_ru, icon, image_url, is_popular) VALUES (?, ?, ?, ?, ?, ?, ?)",
        data)
    conn.commit()
    print(f"[OK] {len(data)} services added")


def seed_projects(conn):
    cursor = conn.cursor()
    data = [
        ('Hilton Garden Inn Tashkent', 'Tashkent', 'General Management', 'Boshqaruv', 5, IMAGES['exterior'], 1, 1),
        ('Grand Hotel Bukhara', 'Bukhara', 'Pre-Opening & Operations', 'Pre-Opening va Operatsiyalar', 5, IMAGES['lobby'], 1, 2),
        ('Samarkand Regency', 'Samarkand', 'Revenue Management', 'Daromadni Boshqarish', 5, IMAGES['room'], 1, 1),
        ('Navoi Palace Hotel', 'Navoi', 'Consulting', 'Konsalting', 4, IMAGES['restaurant'], 0, 3),
        ('Fergana International', 'Fergana', 'Staff Training', 'Xodimlar Tarkibiyish', 4, IMAGES['gym'], 0, 5),
        ('Chorsu Hotel Renovation', 'Tashkent', 'Complete Renovation', "To'liq Renovatsiya", 4, IMAGES['conference'], 0, 4),
        ('Khiva Hotel Maurits', 'Khiva', 'Pre-Opening & Marketing', 'Pre-Opening va Marketing', 5, IMAGES['pool'], 1, 2),
        ('Andijan Premium Suites', 'Andijan', 'General Management', 'Boshqaruv', 4, IMAGES['spa'], 0, 1),
    ]
    cursor.executemany(
        "INSERT INTO projects (name, city, role_en, role_ru, stars, image_url, is_featured, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        data)
    conn.commit()
    print(f"[OK] {len(data)} projects added")


def seed_testimonials(conn):
    cursor = conn.cursor()
    data = [
        ('HotelPro transformed our struggling hotel into a profitable business within 6 months. Their revenue management expertise is unmatched in Central Asia.',
         'HotelPro bizning muammoli mehmonxonamizni 6 oy ichida daromadli biznesga aylantirdi.',
         'Alisher Karimov', 'Owner, Hilton Garden Inn Tashkent', 'Owner, Hilton Garden Inn Tashkent', IMAGES['ceo']),
        ('The pre-opening support was exceptional. They handled everything from staff recruitment to marketing launch.',
         'Pre-opening yordami zo\'r edi. Xodim yollashdan marketing boshigacha hammasini boshqardilar.',
         'Nodira Rustamova', 'General Manager, Grand Hotel Bukhara', 'General Director, Grand Hotel Bukhara', IMAGES['director']),
        ('Professional team with deep industry knowledge. They optimized our F&B operations and increased restaurant revenue by 40%.',
         'Chuqur sanoat bilimiga ega professional jamoa. F&B operatsiyalarimizni optimallashtirdi.',
         'Bekzod Akbarov', 'Director of Operations, Samarkand Regency', 'Operations Director, Samarkand Regency', IMAGES['manager']),
        ('HotelPro staff training program elevated our service quality to international standards.',
         'HotelPro xodimlar tayyorgarlik dasturi xizmat sifatimizni xalqaro standartlarga ko\'tardi.',
         'Gulnora Mahmudova', 'HR Director, Navoi Palace Hotel', 'HR Director, Navoi Palace Hotel', None),
    ]
    cursor.executemany(
        "INSERT INTO testimonials (text_en, text_ru, author, position_en, position_ru, avatar_url) VALUES (?, ?, ?, ?, ?, ?)",
        data)
    conn.commit()
    print(f"[OK] {len(data)} testimonials added")


def seed_partners(conn):
    cursor = conn.cursor()
    data = [
        ('Hilton Worldwide', None, 'brand'),
        ('Marriott International', None, 'brand'),
        ('Accor Hotels', None, 'brand'),
        ('InterContinental Hotels Group', None, 'brand'),
        ('Hyatt Hotels', None, 'brand'),
        ('Uzbekistan Airways', None, 'partner'),
        ('Uzum Travel', None, 'partner'),
        ('Grand-Tour Agency', None, 'partner'),
        ('Silk Road Hotels Association', None, 'partner'),
        ('Tourism Committee Uzbekistan', None, 'partner'),
    ]
    cursor.executemany("INSERT INTO partners (name, logo_url, category) VALUES (?, ?, ?)", data)
    conn.commit()
    print(f"[OK] {len(data)} partners added")


def seed_team(conn):
    cursor = conn.cursor()
    data = [
        ('Alisher Karimov', 'Chief Executive Officer', 'Bosh Direktor',
         'Over 20 years of experience in hotel management across Central Asia.',
         'Markaziy Osiyoda mehmonxona boshqaruvida 20 yildan ortiq tajriba.',
         '@alisher_hotelpro', IMAGES['ceo'], 'https://linkedin.com/in/alisherkarimov', 'ceo@hotelpro.uz'),
        ('Nodira Rustamova', 'Director of Operations', 'Operatsiyalar Direktori',
         'Former General Manager at Hyatt and InterContinental properties.',
         'Hyatt va InterContinental mehmonxonalarida sobiq General Manager.',
         '@nodira_hotelpro', IMAGES['director'], 'https://linkedin.com/in/nodirarustamova', 'operations@hotelpro.uz'),
        ('Bekzod Akbarov', 'Revenue Manager', 'Daromad Menejeri',
         'Certified revenue management professional with yield optimization expertise.',
         'Yield optimallashtirish bo\'yicha malakaga ega sertifikatlangan mutaxassis.',
         '@bekzod_hotelpro', IMAGES['manager'], 'https://linkedin.com/in/bekzodakbarov', 'revenue@hotelpro.uz'),
    ]
    cursor.executemany(
        "INSERT INTO team_members (fullname, role_en, role_ru, bio_en, bio_ru, telegram, image_url, linkedin, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        data)
    conn.commit()
    print(f"[OK] {len(data)} team members added")


def seed_stats(conn):
    cursor = conn.cursor()
    data = [
        ('Hotels Managed', 'Boshqarilayotgan Mehmonxonalar', '60+', 'fa-hotel'),
        ('Years Experience', 'Yillik Tajriba', '15+', 'fa-globe-americas'),
        ('Regions Covered', 'Qamralgan Hududlar', '12', 'fa-map-marked-alt'),
        ('Team Members', "Jamoa A'zolari", '500+', 'fa-users'),
        ('Partner Brands', 'Hamkor Brendlar', '70+', 'fa-handshake'),
        ('Guest Satisfaction', 'Mehmon Mamnuniyati', '98%', 'fa-award'),
    ]
    cursor.executemany("INSERT INTO stats (label_en, label_ru, value, icon) VALUES (?, ?, ?, ?)", data)
    conn.commit()
    print(f"[OK] {len(data)} stats added")


def seed_blogs(conn):
    cursor = conn.cursor()

    blog1_en = """The hospitality industry continues to evolve rapidly. Here are the key trends shaping hotel management in 2026:

1. AI-Powered Revenue Management - Artificial intelligence is revolutionizing how hotels optimize pricing.

2. Sustainability as Standard - Eco-friendly operations are no longer optional.

3. Contactless Technology - Digital check-in, mobile keys have become the norm.

4. Wellness-Focused Amenities - Post-pandemic, wellness amenities are a top priority.

5. Local Experience Integration - Travelers seek authentic local experiences."""

    blog1_ru = """Xostpirt sohasi tez sur\'atlar bilan rivojlanishda davom etmoqda. 2026-yilda asosiy trendlar:

1. AI Asosidagi Daromadni Boshqarish - Sun\'iy intellekt narx optimallashtirishni inqilob qilmoqda.

2. Barqarorlik Standartga Aylandi - Ekologik toza operatsiyalar endi ixtiyoriy emas.

3. Kontaktsiz Texnologiya - Raqamli tekshirish, mobil kalitlar normaga aylangan.

4. Wellnessga Yo\'naltirilgan Imkoniyatlar - Pandemiyadan so\'ng wellness birinchi o\'rinda.

5. Mahalliy Tajriba Integratsiyasi - Sayohatchilar haqiqiy mahalliy tajribalarni qidiradi."""

    blog2_en = """Opening a new hotel is an exciting but challenging endeavor. Here is your pre-opening checklist:

12-6 Months: Finalize management agreements, begin staff recruitment, develop SOPs.

6-3 Months: Start training programs, order FF&E, implement property management systems.

3-1 Month: Conduct soft openings, refine service delivery, prepare grand opening event.

The key to success is attention to detail and thorough preparation."""

    blog2_ru = """Yangi mehmonxonani ochish jiddiy va qiziqarli vazifa. Pre-opening ro\'yxati:

12-6 Oy: Mulk shartnomalarini yakunlash, xodim yollash, SOP ishlab chiqish.

6-3 Oy: Tayyorgarlik dasturlarini boshlash, FF&E buyurtma qilish, tizimlarni o\'rnatish.

3-1 Oy: Soft opening o\'tkazish, xizmatni takomillashtirish, grand opening tayyorlash.

Muvaffaqiyat kaliti - tafsilotlarga e\'tibor va puxta tayyorgarlik."""

    blog3_en = """Yield management is the strategic practice of maximizing revenue by adjusting prices based on demand.

Key Metrics: Occupancy Rate, ADR (Average Daily Rate), RevPAR, Market Penetration Index.

Best Practices:
1. Use automated revenue management systems
2. Maintain rate integrity across channels
3. Create pricing strategies for different segments
4. Review and adjust weekly"""

    blog3_ru = """Yield management - talabga asoslanib narxlarni sozlash orqali daromadni maksimallashtirish.

Asosiy Metrikalar: Bandlik Darajasi, ADR (O\'rtacha Kunlik Narx), RevPAR, Bozor Penetratsiya Indeksi.

Eng Yaxshi Amaliyotlar:
1. Avtomatlashtirilgan tizimlardan foydalaning
2. Kanallar bo\'ylab narx yaxlitligini saqlang
3. Turli segmentlar uchun strategiyalar yarating
4. Haftalik ko\'rib chiqing"""

    import datetime
    now = datetime.datetime.now().isoformat()

    data = [
        ('Top 5 Hotel Management Trends for 2026', '2026-yil uchun 5ta Trend',
         blog1_en, blog1_ru, 'Industry Trends', 'Admin', IMAGES['lobby'], now),
        ('How to Prepare Your Hotel for Pre-Opening', 'Pre-Openingga Tayyorgarlik',
         blog2_en, blog2_ru, 'Operations', 'Admin', IMAGES['exterior'], now),
        ('Maximizing Revenue: Yield Management Guide', 'Daromadni Maksimallashtirish',
         blog3_en, blog3_ru, 'Revenue Management', 'Admin', IMAGES['room'], now),
    ]
    cursor.executemany(
        "INSERT INTO blogs (title_en, title_ru, content_en, content_ru, category, author, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        data)
    conn.commit()
    print(f"[OK] {len(data)} blogs added")


def seed_faqs(conn):
    cursor = conn.cursor()
    data = [
        ('What services does HotelPro offer?',
         'HotelPro qanday xizmatlarni taklif etadi?',
         'HotelPro offers comprehensive hotel management including full operational management, pre-opening support, revenue management, F&B consulting, staff training, and sales & marketing.',
         'HotelPro to\'liq operatsion boshqaruv, pre-opening yordami, daromadni boshqarish, F&B konsalting, xodimlar tayyorgarligi va sotuv & marketing kabi keng qamrovli xizmatlarni taklif etadi.'),
        ('How long does a typical pre-opening project take?',
         'Pre-opening loyihasi qancha vaqt oladi?',
         'A typical pre-opening project takes 6-12 months depending on the size and complexity of the property.',
         'Odatiy pre-opening loyihasi mulkning o\'lchami va murakkabligiga qarab 6-12 oy davom etadi.'),
        ('What is the cost of your hotel management services?',
         'Mehmonxona boshqaruv xizmatlari narxi qancha?',
         'Our pricing is customized based on the scope of services and property size. We offer flexible models.',
         'Narxlar xizmatlar doirasi va mulk o\'lchamiga asoslangan holda moslashtiriladi.'),
        ('Do you work with independent hotels or only chains?',
         'Mustaqil mehmonxonalar bilan ham ishlaysizmi?',
         'We work with both independent properties and hotel chains.',
         'Biz ham mustaqil mulklar, ham mehmonxona tarmoqlari bilan ishlaymiz.'),
        ('How do you measure success?',
         'Muvaffaqiyatni qanday o\'lchaysiz?',
         'We track multiple KPIs including occupancy rate, ADR, RevPAR, guest satisfaction scores.',
         'Biz bandlik darajasi, ADR, RevPAR, mehmon mamnuniyati kabi bir qancha KPIlarni kuzatamiz.'),
        ('What training do your staff receive?',
         'Xodimlaringiz qanday tayyorgarlik oladi?',
         'All HotelPro staff undergo rigorous training including brand standards, guest service protocols, safety procedures.',
         'Barcha HotelPro xodimlari brend standartlari, mehmon xizmat protokollari, xavfsizlik tartiblari bo\'yicha qattiq tayyorgarlikdan o\'tadilar.'),
    ]
    cursor.executemany(
        "INSERT INTO faqs (question_en, question_ru, answer_en, answer_ru) VALUES (?, ?, ?, ?)",
        data)
    conn.commit()
    print(f"[OK] {len(data)} FAQs added")


def seed_timelines(conn):
    cursor = conn.cursor()
    data = [
        ('2009', 'HotelPro founded in Tashkent with a vision to elevate hospitality standards in Central Asia.',
         'HotelPro Toshkentda asos solindi.'),
        ('2012', 'Expanded to 5 hotels across Uzbekistan. First international project in Kazakhstan.',
         'O\'zbekiston bo\'ylab 5 mehmonxonaga kengaydi.'),
        ('2015', 'Opened offices in Samarkand and Bukhara. Partnered with Hilton Worldwide.',
         'Samarqand va Buxoroda ofislar ochdi.'),
        ('2018', 'Surpassed 30 managed properties. Launched F&B consulting division.',
         '30 tadan ortiq mulkni boshqara boshlandi.'),
        ('2020', 'Navigated pandemic challenges successfully. Launched digital transformation initiatives.',
         'Pandemiya muammolarini muvaffaqiyatli yumshatdi.'),
        ('2023', '60+ hotels under management. Expanded to 12 regions across Central Asia.',
         '60+ mehmonxona boshqaruv ostida.'),
        ('2026', 'Leading hospitality management company in Central Asia with 500+ team members.',
         '500+ jamoa a\'zosi bilan yetakchi kompaniya.'),
    ]
    cursor.executemany("INSERT INTO timelines (year, desc_en, desc_ru) VALUES (?, ?, ?)", data)
    conn.commit()
    print(f"[OK] {len(data)} timelines added")


def seed_settings(conn):
    cursor = conn.cursor()
    data = [
        ('hero_title_en', 'Leading Hotel Management Company in Central Asia',
         'Markaziy Osiyoda Yetakchi Mehmonxona Boshqaruv Kompaniyasi'),
        ('hero_subtitle_en', 'Professional management, exceptional results',
         'Professional boshqaruv, mukammal natijalar'),
        ('about_title_en', 'About HotelPro', 'HotelPro Haqida'),
        ('about_text_en', 'HotelPro is a premier hotel management company operating across Central Asia.',
         'HotelPro - Markaziy Osiyo yetakchi mehmonxona boshqaruv kompaniyasi.'),
        ('contact_phone', '+998 71 123 45 67', '+998 71 123 45 67'),
        ('contact_email', 'info@hotelpro.uz', 'info@hotelpro.uz'),
        ('contact_address_en', 'Tashkent City, Amir Temur Avenue, 107B',
         'Toshkent shahri, Amir Temur shoh ko\'chasi, 107B'),
        ('social_telegram', '@hotelpro_uz', '@hotelpro_uz'),
        ('social_instagram', 'hotelpro.uz', 'hotelpro.uz'),
    ]
    cursor.executemany("INSERT INTO settings (key, value_en, value_ru) VALUES (?, ?, ?)", data)
    conn.commit()
    print(f"[OK] {len(data)} settings added")


def seed_applications(conn):
    cursor = conn.cursor()
    import datetime
    now = datetime.datetime.now()
    data = [
        ('John Smith', '+998901234567', 'john.smith@hilton.com',
         'Interested in management services for our new 5-star hotel.', 'Full Hotel Management', 'pending', now),
        ('Maria Petrova', '+998937654321', 'maria@luxuryhotels.uz',
         'Looking for pre-opening support for a boutique hotel.', 'Pre-Opening Services', 'processed', now),
        ('Alex Kim', '+998951112233', 'alex.kim@continental.com',
         'Need revenue management consulting.', 'Revenue Management', 'pending', now),
    ]
    cursor.executemany(
        "INSERT INTO applications (fullname, phone, email, message, service_type, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        data)
    conn.commit()
    print(f"[OK] {len(data)} sample applications added")


def seed_all():
    print("=" * 50)
    print("HotelPro - Complete Seed Script")
    print("=" * 50)

    if not os.path.exists(DB_PATH):
        print(f"[ERROR] Database not found: {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    print(f"[OK] Database connected: {DB_PATH}")

    try:
        clear_all_tables(conn)
        seed_categories(conn)
        seed_services(conn)
        seed_projects(conn)
        seed_testimonials(conn)
        seed_partners(conn)
        seed_team(conn)
        seed_stats(conn)
        seed_blogs(conn)
        seed_faqs(conn)
        seed_timelines(conn)
        seed_settings(conn)
        seed_applications(conn)

        print("\n" + "=" * 50)
        print("SUCCESS! All demo data added.")
        print("=" * 50)

        cursor = conn.cursor()
        print("\nDatabase Summary:")
        for table in ['categories', 'services', 'projects', 'testimonials', 'partners',
                      'team_members', 'stats', 'blogs', 'faqs', 'timelines', 'settings', 'applications']:
            count = cursor.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
            print(f"  {table}: {count}")

    except Exception as e:
        print(f"[ERROR] {e}")
        conn.rollback()
    finally:
        conn.close()


if __name__ == "__main__":
    seed_all()
