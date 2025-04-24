# migrations/versions/d49c997ecf03_.py
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd49c997ecf03'
down_revision = '0763d677d453'
branch_labels = None
depends_on = None

# define exactly the same enum you have in your model
user_role_enum = sa.Enum(
    'admin', 'cliente', 'mesero', 'cocina',
    name='user_role_enum'
)

def upgrade():
    # **1) create the enum type in the DB**
    user_role_enum.create(op.get_bind(), checkfirst=True)

    # **2) add your new columns (including the role)**
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name',     sa.String(120), nullable=False))
        batch_op.add_column(sa.Column('last_name',sa.String(120), nullable=False))
        batch_op.add_column(sa.Column('phone_number', sa.String(120), nullable=False))
        batch_op.add_column(sa.Column(
            'role',
            user_role_enum,
            nullable=False
        ))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False))

def downgrade():
    # reverse the column additions
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('created_at')
        batch_op.drop_column('role')
        batch_op.drop_column('phone_number')
        batch_op.drop_column('last_name')
        batch_op.drop_column('name')

    # **finally drop the enum type**
    user_role_enum.drop(op.get_bind(), checkfirst=True)
