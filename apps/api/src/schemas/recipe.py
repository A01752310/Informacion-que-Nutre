from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    servings: Optional[int] = None
    estimated_cost: Optional[float] = None
    prep_time_minutes: Optional[int] = None
    difficulty: Optional[str] = None
    source_type: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeResponse(RecipeBase):
    id: UUID
    author_id: Optional[UUID] = None
    status: str
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class RecipeSubmissionBase(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    suggested_youtube_url: Optional[str] = None

class RecipeSubmissionCreate(RecipeSubmissionBase):
    pass

class RecipeSubmissionResponse(RecipeSubmissionBase):
    id: UUID
    submitted_by: UUID
    review_notes: Optional[str] = None
    status: str
    created_recipe_id: Optional[UUID] = None
    reviewed_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
