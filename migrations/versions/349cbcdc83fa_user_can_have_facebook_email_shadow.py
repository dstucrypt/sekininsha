"""user can have facebook, email, shadow

Revision ID: 349cbcdc83fa
Revises: 11e48a78b97a
Create Date: 2014-09-22 21:48:23.751737

"""

# revision identifiers, used by Alembic.
revision = '349cbcdc83fa'
down_revision = '11e48a78b97a'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('groups',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.Text(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('shadow',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('ipn', sa.String(length=10), nullable=True),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_shadow_email'), 'shadow', ['email'], unique=False)
    op.create_index(op.f('ix_shadow_ipn'), 'shadow', ['ipn'], unique=False)
    op.add_column(u'users', sa.Column('email', sa.String(), nullable=True))
    op.add_column(u'users', sa.Column('facebook', sa.String(length=20), nullable=True))
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=False)
    op.create_index(op.f('ix_users_facebook'), 'users', ['facebook'], unique=False)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_users_facebook'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_column(u'users', 'facebook')
    op.drop_column(u'users', 'email')
    op.drop_index(op.f('ix_shadow_ipn'), table_name='shadow')
    op.drop_index(op.f('ix_shadow_email'), table_name='shadow')
    op.drop_table('shadow')
    op.drop_table('groups')
    ### end Alembic commands ###
