from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.deps import get_db, get_current_user
from src.models.user import User, Role
from src.models.recipe import Recipe, RecipeSubmission
from src.schemas.recipe import RecipeResponse, RecipeSubmissionCreate, RecipeSubmissionResponse
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[RecipeResponse])
def get_recipes(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    recipes = db.query(Recipe).filter(Recipe.status == "published").offset(skip).limit(limit).all()
    return recipes

@router.get("/{id}", response_model=RecipeResponse)
def get_recipe(id: UUID, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == id, Recipe.status == "published").first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.post("/submissions", response_model=RecipeSubmissionResponse)
def create_recipe_submission(submission_in: RecipeSubmissionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Any registered user can submit
    submission = RecipeSubmission(
        submitted_by=current_user.id,
        title=submission_in.title,
        description=submission_in.description,
        instructions=submission_in.instructions,
        suggested_youtube_url=submission_in.suggested_youtube_url,
        status="pending_review"
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission

@router.get("/submissions/me", response_model=List[RecipeSubmissionResponse])
def get_my_submissions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    submissions = db.query(RecipeSubmission).filter(RecipeSubmission.submitted_by == current_user.id).all()
    return submissions

@router.get("/submissions/pending", response_model=List[RecipeSubmissionResponse])
def get_pending_submissions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Admin or EditorOSF only"""
    if current_user.role and current_user.role.name in ["EditorOSF", "Admin"]:
        submissions = db.query(RecipeSubmission).filter(RecipeSubmission.status == "pending_review").all()
        return submissions
    raise HTTPException(status_code=403, detail="Not enough permissions")

class ReviewPatch(BaseModel):
    status: str
    review_notes: Optional[str] = None

@router.patch("/submissions/{id}/review", response_model=RecipeSubmissionResponse)
def review_submission(id: UUID, review_in: ReviewPatch, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Admin or EditorOSF only"""
    if not current_user.role or current_user.role.name not in ["EditorOSF", "Admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    submission = db.query(RecipeSubmission).filter(RecipeSubmission.id == id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    submission.status = review_in.status
    submission.review_notes = review_in.review_notes
    submission.reviewed_by = current_user.id

    if review_in.status == "approved":
        # Create the canonical recipe automatically
        new_recipe = Recipe(
            title=submission.title,
            description=submission.description,
            instructions=submission.instructions,
            author_id=submission.submitted_by,
            status="published",
            source_type="user_submitted"
        )
        db.add(new_recipe)
        db.commit()
        db.refresh(new_recipe)
        submission.created_recipe_id = new_recipe.id

    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission
