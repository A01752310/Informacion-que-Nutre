/* -------------------------------------------------------
   TypeScript types mirroring the backend Pydantic schemas.
   Source: apps/api/src/schemas/user.py, recipe.py
   ------------------------------------------------------- */

// ---- Auth / Users ----

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserCreate {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  municipality?: string;
  privacy_consent: boolean;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  municipality?: string;
  password?: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  municipality?: string | null;
  is_active: boolean;
  role_id?: string | null;
  created_at: string;
}

// ---- Enums ----

export type RecipeStatus = "draft" | "pending_review" | "approved" | "rejected" | "published";
export type SubmissionStatus = "pending_review" | "approved" | "rejected";
export type VideoStatus = "pending_review" | "approved" | "rejected" | "published";
export type RecipeDifficulty = "easy" | "medium" | "hard";
export type RecipeSourceType = "internal" | "user_submitted";

// ---- Recipes ----

export interface Recipe {
  id: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  author_id?: string | null;
  status: RecipeStatus;
  servings?: number | null;
  estimated_cost?: number | null;
  prep_time_minutes?: number | null;
  difficulty?: RecipeDifficulty | null;
  source_type?: RecipeSourceType | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

// ---- Submissions ----

export interface RecipeSubmissionCreate {
  title: string;
  description?: string;
  instructions?: string;
  suggested_youtube_url?: string;
}

export interface RecipeSubmission {
  id: string;
  submitted_by: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  suggested_youtube_url?: string | null;
  review_notes?: string | null;
  status: SubmissionStatus;
  created_recipe_id?: string | null;
  reviewed_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewPatch {
  status: SubmissionStatus;
  review_notes?: string;
}

// ---- Videos ----

export interface RecipeVideoCreate {
  youtube_url: string;
  recipe_id?: string;
  submission_id?: string;
}

export interface RecipeVideo {
  id: string;
  recipe_id?: string | null;
  submission_id?: string | null;
  submitted_by: string;
  youtube_url: string;
  status: VideoStatus;
  review_notes?: string | null;
  reviewed_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoReviewPatch {
  status: VideoStatus;
  review_notes?: string;
}
