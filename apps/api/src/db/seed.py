from sqlalchemy.orm import Session
from src.db.session import SessionLocal
from src.models.user import Role
from src.models.enums import RoleName

def seed_roles(db: Session):
    roles_data = [
        {"name": RoleName.PUBLIC.value, "description": "Usuarios no autenticados."},
        {"name": RoleName.REGISTERED_USER.value, "description": "Usuarios con cuenta básica permitida para envíos."},
        {"name": RoleName.EDITOR_OSF.value, "description": "Moderador de la asociación para aceptar recetas y contenido."},
        {"name": RoleName.ADMIN.value, "description": "Administrador total del sistema e integraciones."}
    ]
    
    new_roles = []
    for r in roles_data:
        role = db.query(Role).filter(Role.name == r["name"]).first()
        if not role:
            new_roles.append(Role(name=r["name"], description=r["description"]))
    
    if new_roles:
        db.add_all(new_roles)
        db.commit()
        print(f"Added {len(new_roles)} new roles.")
    else:
        print("All roles are already present.")

if __name__ == "__main__":
    db = SessionLocal()
    print("Seeding database roles...")
    seed_roles(db)
    print("Seeding completed.")
