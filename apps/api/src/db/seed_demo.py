from sqlalchemy.orm import Session
from src.db.session import SessionLocal
from src.models.user import User, Role
from src.models.recipe import Recipe, RecipeSubmission, RecipeVideo
from src.models.enums import RoleName, RecipeStatus, SubmissionStatus, VideoStatus
from src.core.security import get_password_hash
import datetime

def seed_demo_data(db: Session):
    # Get Roles
    admin_role = db.query(Role).filter(Role.name == RoleName.ADMIN).first()
    editor_role = db.query(Role).filter(Role.name == RoleName.EDITOR_OSF).first()
    user_role = db.query(Role).filter(Role.name == RoleName.REGISTERED_USER).first()
    
    if not admin_role or not editor_role or not user_role:
        print("Error: Roles not found. Make sure to run seed.py first.")
        return

    # Create Users
    users_data = [
        {"email": "admin@nutre.org", "first_name": "Demo", "last_name": "Admin", "role_id": admin_role.id},
        {"email": "editor@nutre.org", "first_name": "Demo", "last_name": "Editor", "role_id": editor_role.id},
        {"email": "usuario@ejemplo.com", "first_name": "Juan", "last_name": "Usuario", "role_id": user_role.id},
    ]

    users = {}
    for u in users_data:
        user = db.query(User).filter(User.email == u["email"]).first()
        if not user:
            user = User(
                email=u["email"],
                password_hash=get_password_hash("demo123"),
                first_name=u["first_name"],
                last_name=u["last_name"],
                role_id=u["role_id"],
                is_active=True,
                privacy_consent=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        users[u["email"]] = user
    
    admin_user = users["admin@nutre.org"]
    editor_user = users["editor@nutre.org"]
    normal_user = users["usuario@ejemplo.com"]

    # Create Recipes
    recipes_data = [
        {
            "title": "Ensalada de Lentejas",
            "description": "Una ensalada fresca y nutritiva.",
            "instructions": "1. Hervir lentejas\n2. Picar verduras\n3. Mezclar todo",
            "author_id": editor_user.id,
            "status": RecipeStatus.PUBLISHED,
            "servings": 4,
            "estimated_cost": 45.5,
            "prep_time_minutes": 30,
            "published_at": datetime.datetime.now(datetime.timezone.utc)
        },
        {
            "title": "Sopa de Verduras",
            "description": "Sopa caliente para el invierno.",
            "instructions": "1. Picar verduras\n2. Hervir en agua con sal por 20 min.",
            "author_id": admin_user.id,
            "status": RecipeStatus.PUBLISHED,
            "servings": 6,
            "estimated_cost": 30.0,
            "prep_time_minutes": 25,
            "published_at": datetime.datetime.now(datetime.timezone.utc)
        }
    ]

    db_recipes = []
    for r in recipes_data:
        recipe = db.query(Recipe).filter(Recipe.title == r["title"]).first()
        if not recipe:
            recipe = Recipe(**r)
            db.add(recipe)
            db.commit()
            db.refresh(recipe)
        db_recipes.append(recipe)
    
    # Create pending submission
    sub = db.query(RecipeSubmission).filter(RecipeSubmission.title == "Tacos de Frijol con Queso").first()
    if not sub:
        sub = RecipeSubmission(
            submitted_by=normal_user.id,
            title="Tacos de Frijol con Queso",
            description="Receta económica de tacos caseros usando frijoles de la canasta básica.",
            instructions="1. Calentar tortillas\n2. Untar frijoles\n3. Agregar queso",
            status=SubmissionStatus.PENDING_REVIEW,
            suggested_youtube_url="https://youtube.com/watch?v=dQw4w9WgXcQ"
        )
        db.add(sub)
        db.commit()

    # Create a pending video
    if db_recipes:
        vid = db.query(RecipeVideo).filter(RecipeVideo.youtube_url == "https://youtube.com/watch?v=oHg5SJYRHA0").first()
        if not vid:
            vid = RecipeVideo(
                recipe_id=db_recipes[0].id,
                submitted_by=normal_user.id,
                youtube_url="https://youtube.com/watch?v=oHg5SJYRHA0",
                status=VideoStatus.PENDING_REVIEW
            )
            db.add(vid)
            db.commit()

if __name__ == "__main__":
    db = SessionLocal()
    print("Seeding demo data...")
    seed_demo_data(db)
    print("Demo data seeded.")
