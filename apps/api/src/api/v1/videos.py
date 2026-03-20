from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.api.deps import get_db, get_current_user, RoleChecker
from src.models.user import User
from src.models.recipe import RecipeVideo, Recipe
from src.models.enums import VideoStatus, RecipeStatus, RoleName
from src.schemas.recipe import RecipeVideoCreate, RecipeVideoResponse, VideoReviewPatch
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=RecipeVideoResponse)
def create_recipe_video(video_in: RecipeVideoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    video = RecipeVideo(
        submitted_by=current_user.id,
        youtube_url=video_in.youtube_url,
        recipe_id=video_in.recipe_id,
        submission_id=video_in.submission_id,
        status=VideoStatus.PENDING_REVIEW
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    return video

@router.get("/me", response_model=List[RecipeVideoResponse])
def get_my_videos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    videos = db.query(RecipeVideo).filter(RecipeVideo.submitted_by == current_user.id).all()
    return videos

@router.get("/pending", response_model=List[RecipeVideoResponse])
def get_pending_videos(db: Session = Depends(get_db), current_user: User = Depends(RoleChecker([RoleName.EDITOR_OSF, RoleName.ADMIN]))):
    videos = db.query(RecipeVideo).filter(RecipeVideo.status == VideoStatus.PENDING_REVIEW).all()
    return videos

@router.patch("/{id}/review", response_model=RecipeVideoResponse)
def review_video(id: UUID, review_in: VideoReviewPatch, db: Session = Depends(get_db), current_user: User = Depends(RoleChecker([RoleName.EDITOR_OSF, RoleName.ADMIN]))):
    video = db.query(RecipeVideo).filter(RecipeVideo.id == id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # State mutation logic
    new_status = review_in.status
    if new_status == VideoStatus.APPROVED and video.recipe_id:
        recipe = db.query(Recipe).filter(Recipe.id == video.recipe_id).first()
        if recipe and recipe.status == RecipeStatus.PUBLISHED:
            new_status = VideoStatus.PUBLISHED

    video.status = new_status
    video.review_notes = review_in.review_notes
    video.reviewed_by = current_user.id

    db.add(video)
    db.commit()
    db.refresh(video)
    return video
