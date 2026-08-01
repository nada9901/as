"""Initial HealthGluco schema

Revision ID: 0001
Revises: 
Create Date: 2026-07-31 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('email', sa.String(length=255), unique=True, nullable=False, index=True),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=32), nullable=False, default='Patient'),
        sa.Column('age_group', sa.Integer(), nullable=False, default=7),
        sa.Column('sex', sa.Integer(), nullable=False, default=0),
        sa.Column('bmi', sa.Float(), nullable=False, default=24.0),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.String(length=64), nullable=False),
        sa.Column('last_login', sa.String(length=64), nullable=True)
    )

    # Predictions table
    op.create_table(
        'predictions',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('user_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('bmi', sa.Float(), nullable=False),
        sa.Column('high_bp', sa.Integer(), nullable=False),
        sa.Column('high_chol', sa.Integer(), nullable=False),
        sa.Column('chol_check', sa.Integer(), nullable=False),
        sa.Column('stroke', sa.Integer(), nullable=False),
        sa.Column('heart_disease_or_attack', sa.Integer(), nullable=False),
        sa.Column('smoker', sa.Integer(), nullable=False),
        sa.Column('hvy_alcohol_consump', sa.Integer(), nullable=False),
        sa.Column('phys_activity', sa.Integer(), nullable=False),
        sa.Column('fruits', sa.Integer(), nullable=False),
        sa.Column('veggies', sa.Integer(), nullable=False),
        sa.Column('ment_hlth', sa.Integer(), nullable=False),
        sa.Column('phys_hlth', sa.Integer(), nullable=False),
        sa.Column('diff_walk', sa.Integer(), nullable=False),
        sa.Column('gen_hlth', sa.Integer(), nullable=False),
        sa.Column('sex', sa.Integer(), nullable=False),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('education', sa.Integer(), nullable=False),
        sa.Column('income', sa.Integer(), nullable=False),
        sa.Column('any_healthcare', sa.Integer(), nullable=False),
        sa.Column('no_docbc_cost', sa.Integer(), nullable=False),
        sa.Column('probability', sa.Float(), nullable=False),
        sa.Column('prediction_class', sa.Integer(), nullable=False),
        sa.Column('risk_tier', sa.String(length=32), nullable=False),
        sa.Column('color_code', sa.String(length=16), nullable=False),
        sa.Column('created_at', sa.String(length=64), nullable=False)
    )

    # RecommendationHistory table
    op.create_table(
        'recommendation_history',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('prediction_id', sa.String(length=64), sa.ForeignKey('predictions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('top_risk_factors', sa.String(length=1024), nullable=False),
        sa.Column('recommendations', sa.String(length=4096), nullable=False),
        sa.Column('created_at', sa.String(length=64), nullable=False)
    )

    # AuditLogs table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('user_id', sa.String(length=64), nullable=False),
        sa.Column('action', sa.String(length=128), nullable=False),
        sa.Column('endpoint', sa.String(length=255), nullable=False),
        sa.Column('ip_address', sa.String(length=64), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=False),
        sa.Column('timestamp', sa.String(length=64), nullable=False),
        sa.Column('details', sa.String(length=512), nullable=True)
    )

    # RefreshTokens table
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('user_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token', sa.String(length=512), unique=True, nullable=False),
        sa.Column('expires_at', sa.String(length=64), nullable=False),
        sa.Column('revoked', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.String(length=64), nullable=False)
    )

    # SystemSettings table
    op.create_table(
        'system_settings',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('setting_key', sa.String(length=128), unique=True, nullable=False),
        sa.Column('setting_value', sa.String(length=1024), nullable=False),
        sa.Column('description', sa.String(length=512), nullable=False),
        sa.Column('updated_at', sa.String(length=64), nullable=False)
    )

    # Notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('user_id', sa.String(length=64), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.String(length=1024), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, default=False),
        sa.Column('notification_type', sa.String(length=64), nullable=False),
        sa.Column('created_at', sa.String(length=64), nullable=False)
    )


def downgrade() -> None:
    op.drop_table('notifications')
    op.drop_table('system_settings')
    op.drop_table('refresh_tokens')
    op.drop_table('audit_logs')
    op.drop_table('recommendation_history')
    op.drop_table('predictions')
    op.drop_table('users')
