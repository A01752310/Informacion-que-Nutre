from sqlalchemy.orm import Session
from src.db.session import SessionLocal
from src.models.user import Role

def seed_roles(db: Session):
    roles = ["Public", "RegisteredUser", "EditorOSF", "Admin"]
    for role_name in roles:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            new_role = Role(name=role_name)
            db.add(new_role)
    db.commit()

if __name__ == "__main__":
    db = SessionLocal()
    print("Seeding database...")
    seed_roles(db)
    print("Seeding completed.")
