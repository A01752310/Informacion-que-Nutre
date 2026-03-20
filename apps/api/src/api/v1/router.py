from fastapi import APIRouter
from src.api.v1 import health, auth, users, recipes, videos

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(recipes.router, prefix="/recipes", tags=["Recipes"])
api_router.include_router(videos.router, prefix="/recipes/videos", tags=["Videos"])
