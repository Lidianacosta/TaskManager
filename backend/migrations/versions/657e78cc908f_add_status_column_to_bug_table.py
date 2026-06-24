"""add_status_column_to_bug_table

Revision ID: 657e78cc908f
Revises: 9ae5530549c3
Create Date: 2026-06-23 21:52:52.433987

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '657e78cc908f'
down_revision: Union[str, Sequence[str], None] = '9ae5530549c3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('bug', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(), nullable=False, server_default='open'))


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('bug', schema=None) as batch_op:
        batch_op.drop_column('status')
