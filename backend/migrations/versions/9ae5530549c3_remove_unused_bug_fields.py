"""remove_unused_bug_fields

Revision ID: 9ae5530549c3
Revises: 997a64ea1549
Create Date: 2026-06-23 21:35:16.707907

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '9ae5530549c3'
down_revision: Union[str, Sequence[str], None] = '997a64ea1549'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    dialect = bind.dialect.name
    
    if dialect == 'postgresql':
        op.execute('ALTER TABLE "bug" DROP CONSTRAINT IF EXISTS "bug_user_id_fkey"')
        op.execute('ALTER TABLE "bug" DROP CONSTRAINT IF EXISTS "fk_bug_user_id"')

    with op.batch_alter_table('bug', schema=None) as batch_op:
        batch_op.drop_column('user_id')
        batch_op.drop_column('status')
        batch_op.drop_column('priority')
        batch_op.drop_column('steps_to_reproduce')
        batch_op.drop_column('environment')
        batch_op.drop_column('version')
        batch_op.drop_column('url')
        batch_op.drop_column('user_agent')
        batch_op.drop_column('issue_number')
        batch_op.drop_column('issue_url')


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('bug', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('priority', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('steps_to_reproduce', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('environment', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('version', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('url', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('user_agent', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('issue_number', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('issue_url', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_bug_user_id', 'user', ['user_id'], ['id'])

