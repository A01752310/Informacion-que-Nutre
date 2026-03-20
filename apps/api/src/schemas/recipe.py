from pydantic import BaseModel, Field, model_validator
from uuid import UUID
from datetime import datetime
from typing import Optional
from src.models.enums import RecipeStatus, SubmissionStatus, VideoStatus, RecipeDifficulty, RecipeSourceType

YOUTUBE_REGEX = r"^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$"


class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    servings: Optional[int] = None
    estimated_cost: Optional[float] = None
    prep_time_minutes: Optional[int] = None
    difficulty: Optional[RecipeDifficulty] = None
    source_type: Optional[RecipeSourceType] = None


class RecipeCreate(RecipeBase):
    pass


class RecipeResponse(RecipeBase):
    id: UUID
    author_id: Optional[UUID] = None
    status: RecipeStatus
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class RecipeSubmissionBase(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    suggested_youtube_url: Optional[str] = Field(None, pattern=YOUTUBE_REGEX)


class RecipeSubmissionCreate(RecipeSubmissionBase):
    pass


class RecipeSubmissionResponse(RecipeSubmissionBase):
    id: UUID
    submitted_by: UUID
    review_notes: Optional[str] = None
    status: SubmissionStatus
    created_recipe_id: Optional[UUID] = None
    reviewed_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReviewPatch(BaseModel):
    status: SubmissionStatus
    review_notes: Optional[str] = None


class RecipeVideoBase(BaseModel):
    youtube_url: str = Field(..., pattern=YOUTUBE_REGEX)


class RecipeVideoCreate(RecipeVideoBase):
    recipe_id: Optional[UUID] = None
    submission_id: Optional[UUID] = None

    @model_validator(mode="after")
    def check_exclusive_reference(self):
        if self.recipe_id and self.submission_id:
            raise ValueError("Provide recipe_id or submission_id, not both.")
        return self

class RecipeVideoResponse(RecipeVideoBase):
    id: UUID
    recipe_id: Optional[UUID] = None
    submission_id: Optional[UUID] = None
    submitted_by: UUID
    status: VideoStatus
    review_notes: Optional[str] = None
    reviewed_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class VideoReviewPatch(BaseModel):
    status: VideoStatus
    review_notes: Optional[str] = None
