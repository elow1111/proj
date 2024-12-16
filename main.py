from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import Note, Tag
from pydantic import BaseModel
from typing import List
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

# Инициализация приложения FastAPI
app = FastAPI()

# Создание всех таблиц в базе данных (если их нет)
Base.metadata.create_all(bind=engine)

# Функция для получения сессии с базой данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Простая модель для заметки при создании
class NoteCreate(BaseModel):
    title: str
    content: str

    class Config:
        orm_mode = True

# Модель для обновления заметки
class NoteUpdate(BaseModel):
    title: str
    content: str

    class Config:
        orm_mode = True

# Модель для представления заметки
class NoteOut(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        orm_mode = True

# Модель для тегов
class TagCreate(BaseModel):
    name: str

    class Config:
        orm_mode = True

class TagOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

# Логика для авторизации
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Пример тестового пользователя
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "password": "testpassword"
    }
}

# Секретный ключ для генерации токенов
SECRET_KEY = "SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Класс для данных пользователя
class User(BaseModel):
    username: str

# Класс для пользователя в базе данных
class UserInDB(User):
    password: str

# Функция для создания токена
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Эндпоинт для получения токена
@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or user['password'] != form_data.password:
        raise HTTPException(
            status_code=HTTPException.status_code,
            detail="Incorrect username or password",
        )
    
    token = create_access_token(data={"sub": form_data.username})
    return {"access_token": token, "token_type": "bearer"}

# Защищённый маршрут
@app.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=403, detail="Could not validate credentials")
        return {"message": f"Hello {username}!"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")

# Простой маршрут для теста
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Эндпоинт для создания заметки
@app.post("/notes/", response_model=NoteOut)
async def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

# Эндпоинт для получения всех заметок
@app.get("/notes/", response_model=List[NoteOut])
async def get_notes(db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    return notes

# Эндпоинт для получения заметки по id
@app.get("/notes/{note_id}", response_model=NoteOut)
async def get_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

# Эндпоинт для обновления заметки
@app.put("/notes/{note_id}", response_model=NoteOut)
async def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")

    db_note.title = note.title
    db_note.content = note.content
    db.commit()
    db.refresh(db_note)
    return db_note

# Эндпоинт для удаления заметки
@app.delete("/notes/{note_id}")
async def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted"}

# Эндпоинт для создания тега
@app.post("/tags/", response_model=TagOut)
async def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    db_tag = Tag(name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

# Эндпоинт для получения всех тегов
@app.get("/tags/", response_model=List[TagOut])
async def get_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).all()
    return tags

# Разрешаем доступ с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Указываем URL вашего фронтенда
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы
    allow_headers=["*"],  # Разрешаем все заголовки
)