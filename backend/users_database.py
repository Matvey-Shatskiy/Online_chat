import sqlite3
from datetime import datetime, timedelta
from config import DATABASE_FILE
import uuid
from security import verify_password, create_access_token, hash_password

def init_db():
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()

    c.execute('''PRAGMA foreign_keys = ON''')

    c.execute(""" CREATE TABLE IF NOT EXISTS users (
                uuid TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                last_seen_at TIMESTAMP,
                user_image TEXT,
                bio VARCHAR(100),
                birthday DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    c.execute("""CREATE TABLE IF NOT EXISTS history (
                uuid TEXT PRIMARY KEY,
                message TEXT NOT NULL,
                sender_uuid TEXT NOT NULL,
                receiver_uuid TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_uuid) REFERENCES users(uuid),
                FOREIGN KEY (receiver_uuid) REFERENCES users(uuid))""")

    conn.commit()
    conn.close()

def registration_user(username: str, email: str, password: str, created_at: datetime):
    password_hash = hash_password(password)
    new_uuid = str(uuid.uuid4())
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''INSERT INTO users (uuid, username, email, password_hash, created_at)
                VALUES (?, ?, ?, ?, ?)''',
              (new_uuid, username, email, password_hash, created_at))
    conn.commit()
    conn.close()

def login_user(email: str, password: str) -> tuple[str, str, str] | None:
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        c = conn.cursor()
        c.execute('''SELECT uuid, password_hash, username FROM users WHERE email = ?''', (email,))
        user_uuid, password_hash, username = c.fetchone()
        if verify_password(password, password_hash):
            result = (create_access_token(data=dict(sub=email), expires_delta=timedelta(minutes=5)), user_uuid, username)
            conn.close()
            return result
        else:
            conn.close()
            return None
    except():
        return None

def new_message(message_uuid: str, message: str ,sender_uuid: str, recipient_uuid: str):
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''INSERT INTO history (uuid, message, sender_uuid, receiver_uuid, timestamp)
            VALUES (?, ?, ?, ?, ?)''',(message_uuid, message, sender_uuid, recipient_uuid, str(datetime.now())))
    conn.commit()
    conn.close()
    return message_uuid

def get_all_history():
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''SELECT * FROM history JOIN users ON users.uuid = history.sender_uuid''')
    history_db = c.fetchall()
    history = []
    for row in history_db:
            row = {
                'uuid': row[0],
                'message': row[1],
                'senderUuid': row[2],
                'receiverUuid': row[3],
                'senderUserName': row[6],
                'senderEmail': row[7],
                'createdAt': row[4],
            }
            history.append(row)
    conn.close()
    return history

def get_history(sender_uuid: str, receiver_uuid: str):
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''SELECT * FROM history JOIN users ON users.uuid = history.sender_uuid 
                WHERE (sender_uuid = ? AND receiver_uuid = ?)
                OR (sender_uuid = ? AND receiver_uuid = ?)
                ORDER BY timestamp ASC''',
              (sender_uuid, receiver_uuid, receiver_uuid, sender_uuid))
    history_db = c.fetchall()
    history = []
    for row in history_db:
        row = {
            'uuid': row[0],
            'message': row[1],
            'senderUuid': row[2],
            'receiverUuid': row[3],
            'senderUserName': row[6],
            'senderEmail': row[7],
            'createdAt': row[4],
        }
        history.append(row)
    conn.close()
    return history

def gel_all_users(user_uuid: str, connections: dict) -> list:
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''SELECT uuid, username, email, last_seen_at, user_image FROM users WHERE uuid != ?''',
              (user_uuid,))
    user_db = c.fetchall()
    users = []
    for row in user_db:
        other_user_uuid = row[0]
        c.execute('''
                    SELECT message, timestamp, sender_uuid
                    FROM history
                    WHERE (sender_uuid = ? AND receiver_uuid = ?)
                       OR (sender_uuid = ? AND receiver_uuid = ?)
                    ORDER BY timestamp DESC
                    LIMIT 1
                ''', (user_uuid, other_user_uuid, other_user_uuid, user_uuid))
        last_message = c.fetchone()

        row = {
            'uuid': row[0],
            'userName': row[1],
            'email': row[2],
            'isOnline': row[0] in connections,
            'lastSeen': row[3],
            'image': row[4],
            'lastMessage': last_message[0] if last_message else None,
            'lastMessageTime': last_message[1] if last_message else None,
            'lastMessageUuid': last_message[2] if last_message else None,
            }
        users.append(row)
    conn.close()
    return users

def get_user_by_username(search: str):
    if search is None:
        return None
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''SELECT uuid, username, email, birthday, bio, image FROM Users WHERE username LIKE %?%''',
              (search,))
    user_db = c.fetchall()
    users = []
    for row in user_db:
        row = {
            'uuid': row[0],
            'userName': row[1],
            'email': row[2],
            'birthday': row[3],
            'bio': row[4],
            'image': row[5],
        }
        users.append(row)
    conn.close()
    return users

def set_last_seen(user_uuid: str):
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''UPDATE Users SET last_seen_at = ? WHERE uuid = ?''',
              (datetime.now(), user_uuid))
    conn.commit()
    conn.close()

def set_profile(user_uuid: str, bio: str, birthdate: datetime):
    if len(bio.strip()) >= 100:
        return False
    else:
        conn = sqlite3.connect(DATABASE_FILE)
        c = conn.cursor()
        c.execute('''UPDATE users SET bio = ?, birthday = ? WHERE uuid = ?''',
                  (bio, birthdate,user_uuid ))
        conn.commit()
        conn.close()
        return True

def set_profile_image(user_uuid: str, image_url: str):
    print(f'image_url: {image_url}')
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''UPDATE users SET user_image = ? WHERE uuid = ?''',
              (image_url, user_uuid))
    conn.commit()
    conn.close()
    return True

def get_profile_image(user_uuid: str):
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''SELECT user_image FROM users WHERE uuid = ?''',
              (user_uuid,))
    image_url = c.fetchone()
    conn.commit()
    conn.close()
    return image_url

def get_profile_by_uuid(user_uuid: str):
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute('''SELECT bio, email, birthday, user_image FROM Users WHERE uuid = ?''',
              (user_uuid,))
    result = c.fetchone()
    response = {
        'bio': result[0],
        'email': result[1],
        'birthdate': result[2],
        'image': result[3]
    }
    conn.close()
    return response