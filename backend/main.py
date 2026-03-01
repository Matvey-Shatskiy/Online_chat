from fastapi import FastAPI, Body, WebSocket, WebSocketDisconnect, Query, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from users_database import (init_db, registration_user, login_user, new_message,
                            get_all_history, gel_all_users, get_user_by_username, set_last_seen,
                            get_history, set_profile, get_profile_by_uuid, set_profile_image,
                            get_profile_image)
from datetime import datetime
import json
import uuid
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.post("/register")
async def register(data = Body()):
    username = data["userName"]
    email = data["email"]
    password = data["password"]
    registration_user(username, email, password, datetime.now())
    return {'message': 'Registration successful'}

@app.post("/login")
async def login(data = Body()):
    email = data["email"]
    password = data["password"]
    response = login_user(email, password)
    if response is None:
        return None
    data = {'access_token': response[0],
            'user':{
                'uuid': response[1],
                'email': email,
                'userName': response[2]
            }
        }
    return data

@app.put("/api/profile/{user_uuid}")
async def profile(user_uuid, data = Body()):
    bio = data["bio"]
    birthdate = data["birthdate"]
    print(f'bio: {bio}')
    return set_profile(user_uuid, bio, birthdate)

@app.post("/api/profile/{user_uuid}/image")
async def upload_image(user_uuid: str, image: UploadFile = File(...)):
    # Проверяем, что это изображение
    allowed_types = ["image/jpeg", "image/png", "image/gif"]
    if image.content_type not in allowed_types:
        return {"error": "Invalid file type"}
    print(image)
    # Генерируем имя файла
    ext = os.path.splitext(image.filename)[1]
    filename = f"{user_uuid}_{uuid.uuid4()}{ext}"
    filepath = f"uploads/{filename}"

    content = await image.read()
    with open(filepath, "wb") as f:
        f.write(content)

    image_url = f"/uploads/{filename}"
    set_profile_image(user_uuid, image_url)
    return {"image": image_url}

@app.get("/api/profile/{user_uuid}/image")
async def get_image(user_uuid: str):
    get_profile_image(user_uuid)

@app.get("/api/profile/{user_uuid}")
async def get_profile(user_uuid):
    return get_profile_by_uuid(user_uuid)

@app.get("/api/search")
async def search_users(search: str = Query(None)):
    return get_user_by_username(search)

@app.get("/api/protected")
def protected():
    return {'message':'I love Rita. She\'s the best!'}

@app.get("/api/history/{sender_uuid}/{receiver_uuid}")
def history(sender_uuid, receiver_uuid):
    return get_history(sender_uuid, receiver_uuid)

def create_response_json(user_uuid: str, is_online: bool):
    response_online_json = {
        'type': 'user_status',
        'uuid': user_uuid,
        'isOnline': is_online,
    }
    return json.dumps(response_online_json)

active_connections = {}

@app.websocket("/ws")
async def websocket_endpoint(
        websocket: WebSocket,
        user_uuid: str = Query(None)
):
    await websocket.accept()
    if user_uuid:
        response = create_response_json(user_uuid, True)
        for user in active_connections:
            await active_connections[user].send_text(response)
        active_connections[user_uuid] = websocket
        all_users_json = {
            'type': 'users',
            'users': gel_all_users(user_uuid, active_connections)
        }
        await active_connections[user_uuid].send_json(all_users_json)

    print(f"Новое подключение. Всего: {len(active_connections)}")

    try:
        history_json = {
            'type': 'history',
            'messages': get_all_history()
        }
        for user_uuid in active_connections:
            await active_connections[user_uuid].send_text(json.dumps(history_json))
        while True:
            data = await websocket.receive_text()
            json_data = json.loads(data)
            print(f"Сообщение от {json_data['senderUserName']}")
            message_uuid = str(uuid.uuid4())

            response = {
                'uuid': message_uuid,
                'message': json_data['message'],
                'senderUuid': json_data['senderUuid'],
                'receiverUuid': json_data['receiverUuid'],
                'senderUserName': json_data['senderUserName'],
                'senderEmail': json_data['senderEmail'],
                'createdAt': datetime.now().isoformat(),
                'type': 'message'
            }

            new_message(message_uuid, json_data['message'], json_data['senderUuid'], json_data['receiverUuid'])

            response_json = json.dumps(response)
            print(response_json)
            try:
                await active_connections[json_data['senderUuid']].send_text(response_json)
                await active_connections[json_data['receiverUuid']].send_text(response_json)
            except Exception as e:
                print(f"Ошибка отправки: {e}")

    except WebSocketDisconnect:
        print(f"Отключился. Осталось: {len(active_connections)}")
        if user_uuid in active_connections:
            response = create_response_json(user_uuid, False)
            set_last_seen(user_uuid)
            del active_connections[user_uuid]
            for user in active_connections:
                await active_connections[user].send_text(response)
    except Exception as e:
        print(f"Ошибка: {e}")
        if user_uuid in active_connections:
            response = create_response_json(user_uuid, False)
            set_last_seen(user_uuid)
            del active_connections[user_uuid]
            for user in active_connections:
                await active_connections[user].send_text(response)
