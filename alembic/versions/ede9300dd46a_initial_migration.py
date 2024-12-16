"""initial migration

Revision ID: ede9300dd46a
Revises: 
Create Date: 2024-12-16 19:45:54.773959
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'ede9300dd46a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Создание таблицы users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(50), unique=True, nullable=False),
        sa.Column('password', sa.String(255), nullable=False)
    )

    # Создание таблицы notes
    op.create_table(
        'notes',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now(), nullable=False)
    )

    # Создание таблицы tags (пример)
    op.create_table(
        'tags',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(50), unique=True, nullable=False)
    )

def downgrade() -> None:
    # Удаление таблиц в обратном порядке
    op.drop_table('tags')
    op.drop_table('notes')
    op.drop_table('users')
