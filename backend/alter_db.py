import sqlite3

def alter():
    conn = sqlite3.connect('hotel_pro.db')
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE services ADD COLUMN image_url VARCHAR")
        conn.commit()
        print("Column added successfully.")
    except Exception as e:
        print("Error/Already added:", e)
    finally:
        conn.close()

if __name__ == '__main__':
    alter()
