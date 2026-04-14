import sqlite3
import os

def migrate():
    db_path = os.path.join(os.path.dirname(__file__), 'hotel.db')
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}. Skipping migration.")
        return

    print(f"Connecting to database at {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if category column exists
        cursor.execute("PRAGMA table_info(partners)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'category' not in columns:
            print("Adding 'category' column to 'partners' table...")
            cursor.execute("ALTER TABLE partners ADD COLUMN category VARCHAR DEFAULT 'brand'")
            conn.commit()
            print("Migration successful: 'category' column added.")
        else:
            print("'category' column already exists. Skipping.")

    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
