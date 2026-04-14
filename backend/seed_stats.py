import sqlite3

conn = sqlite3.connect('hotel.db')
c = conn.cursor()

# Fix all stats with proper data
updates = [
    (1, 'Hotels', 'Отели', '60+', 'FaHotel'),
    (2, 'Experience', 'Опыт', '15+', 'FaGlobeAmericas'),
    (3, 'Regions', 'Регионы', '12', 'FaMapMarkerAlt'),
    (4, 'Staff', 'Сотрудники', '500+', 'FaUsers'),
    (5, 'Brands', 'Бренды', '70+', 'FaHandshake'),
    (6, 'Satisfaction', 'Удовлетворённость', '98%', 'FaAward'),
]

for stat_id, label_en, label_ru, value, icon in updates:
    c.execute(
        'UPDATE stats SET label_en=?, label_ru=?, value=?, icon=? WHERE id=?',
        (label_en, label_ru, value, icon, stat_id)
    )

conn.commit()

print('Updated stats:')
for row in c.execute('SELECT id, label_en, label_ru, value, icon FROM stats').fetchall():
    print(f'  id={row[0]} en={row[1]} ru={row[2]} val={row[3]} icon={row[4]}')

conn.close()
print('Done!')
