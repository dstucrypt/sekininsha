"""vote model

Revision ID: 43a83ffa2725
Revises: 452139bdd1d8
Create Date: 2014-10-11 02:37:12.732382

"""

# revision identifiers, used by Alembic.
revision = '43a83ffa2725'
down_revision = '452139bdd1d8'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('vote',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.Text(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('state', sa.Integer(), nullable=True),
    sa.Column('result', sa.Integer(), nullable=True),
    sa.Column('ctime', sa.DateTime(), nullable=True),
    sa.Column('etime', sa.DateTime(), nullable=True),
    sa.Column('dtime', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('vote')
    ### end Alembic commands ###
