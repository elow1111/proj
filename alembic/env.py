from __future__ import with_statement
import sys
import os
from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlalchemy.ext.declarative import declarative_base
from logging.config import fileConfig

# Путь к вашей базе данных
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import Base  # Подключаем Base из вашего проекта
from models import Note, Tag  # Импортируйте ваши модели

# Импортируйте настройки и метаданные
target_metadata = Base.metadata  # Это ваша метадата для миграций

# Конфигурация для Alembic
config = context.config
fileConfig(config.config_file_name)
