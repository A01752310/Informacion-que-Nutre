import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from src.db.base import Base
from src.models.enums import RecipeStatus, SubmissionStatus, VideoStatus, RecipeDifficulty, RecipeSourceType

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    instructions = Column(Text)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(SQLEnum(RecipeStatus), default=RecipeStatus.DRAFT)
    servings = Column(Integer)
    estimated_cost = Column(Float)
    prep_time_minutes = Column(Integer)
    difficulty = Column(SQLEnum(RecipeDifficulty), nullable=True)
    source_type = Column(SQLEnum(RecipeSourceType), nullable=True)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class RecipeSubmission(Base):
    __tablename__ = "recipe_submissions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submitted_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text)
    instructions = Column(Text)
    suggested_youtube_url = Column(String)
    review_notes = Column(Text)
    status = Column(SQLEnum(SubmissionStatus), default=SubmissionStatus.PENDING_REVIEW)
    created_recipe_id = Column(UUID(as_uuid=True), ForeignKey("recipes.id"), nullable=True)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class RecipeVideo(Base):
    __tablename__ = "recipe_videos"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipe_id = Column(UUID(as_uuid=True), ForeignKey("recipes.id"), nullable=True)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("recipe_submissions.id"), nullable=True)
    submitted_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    youtube_url = Column(String, nullable=False)
    review_notes = Column(Text)
    status = Column(SQLEnum(VideoStatus), default=VideoStatus.PENDING_REVIEW)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    category = Column(String)
    is_basic_basket = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    recipe_id = Column(UUID(as_uuid=True), ForeignKey("recipes.id"), primary_key=True)
    ingredient_id = Column(UUID(as_uuid=True), ForeignKey("ingredients.id"), primary_key=True)
    quantity = Column(Float)
    unit = Column(String)
