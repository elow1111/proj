from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Замените строку подключения на актуальные данные для вашего проекта
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1234rt@localhost/notes_app"

# Создаём движок подключения
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Создаём сессию
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()
