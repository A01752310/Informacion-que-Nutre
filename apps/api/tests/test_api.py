import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.main import app
from src.db.base import Base
from src.api.deps import get_db
from src.models.user import Role, User
from src.models.enums import RoleName
from src.core.security import get_password_hash

# Ephemeral file-based SQLite DB for test isolation
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed roles
    roles = [
        Role(name=RoleName.PUBLIC.value, description="Public"),
        Role(name=RoleName.REGISTERED_USER.value, description="User"),
        Role(name=RoleName.EDITOR_OSF.value, description="Editor"),
        Role(name=RoleName.ADMIN.value, description="Admin"),
    ]
    for r in roles:
        if not db.query(Role).filter(Role.name == r.name).first():
            db.add(r)
    db.commit()

    # Seed an admin user for review tests
    admin_role = (
        db.query(Role).filter(Role.name == RoleName.ADMIN.value).first()
    )
    if not db.query(User).filter(User.email == "admin@test.com").first():
        admin = User(
            email="admin@test.com",
            password_hash=get_password_hash("admin123"),
            first_name="Admin",
            role_id=admin_role.id,
            is_active=True,
            privacy_consent=True,
        )
        db.add(admin)
        db.commit()

    yield
    db.close()
    Base.metadata.drop_all(bind=engine)


# ── Helpers ──────────────────────────────────────────────


def _login(email: str, password: str) -> str:
    resp = client.post(
        "/api/v1/auth/login", data={"username": email, "password": password}
    )
    assert resp.status_code == 200
    return resp.json()["access_token"]


def _auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ── Tests ────────────────────────────────────────────────


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200


def test_register_and_login():
    # Register
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123",
            "first_name": "Test",
        },
    )
    assert resp.status_code == 200

    # Login
    resp = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "password123"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_recipe_submission():
    token = _login("test@example.com", "password123")
    resp = client.post(
        "/api/v1/recipes/submissions",
        json={
            "title": "Healthy Salad",
            "description": "A very healthy salad.",
            "instructions": "Mix greens.",
            "suggested_youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        headers=_auth_header(token),
    )
    assert resp.status_code == 200
    assert resp.json()["title"] == "Healthy Salad"
    assert resp.json()["status"] == "pending_review"


def test_submission_review():
    """Admin reviews and approves a pending submission."""
    admin_token = _login("admin@test.com", "admin123")
    headers = _auth_header(admin_token)

    # Fetch pending submissions
    resp = client.get(
        "/api/v1/recipes/submissions/pending", headers=headers
    )
    assert resp.status_code == 200
    pending = resp.json()
    assert len(pending) >= 1

    submission_id = pending[0]["id"]

    # Approve
    resp = client.patch(
        f"/api/v1/recipes/submissions/{submission_id}/review",
        json={"status": "approved", "review_notes": "Looks great!"},
        headers=headers,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "approved"
    assert body["created_recipe_id"] is not None


def test_video_submission():
    token = _login("test@example.com", "password123")
    resp = client.post(
        "/api/v1/recipes/videos/",
        json={"youtube_url": "https://youtube.com/watch?v=test"},
        headers=_auth_header(token),
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "pending_review"


def test_video_review():
    """Admin reviews and approves a pending video."""
    admin_token = _login("admin@test.com", "admin123")
    headers = _auth_header(admin_token)

    # Fetch pending videos
    resp = client.get(
        "/api/v1/recipes/videos/pending", headers=headers
    )
    assert resp.status_code == 200
    pending = resp.json()
    assert len(pending) >= 1

    video_id = pending[0]["id"]

    # Approve
    resp = client.patch(
        f"/api/v1/recipes/videos/{video_id}/review",
        json={"status": "approved", "review_notes": "Video ok"},
        headers=headers,
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "approved"


def test_video_create_rejects_both_ids():
    """Schema rejects payload with both recipe_id and submission_id."""
    token = _login("test@example.com", "password123")
    resp = client.post(
        "/api/v1/recipes/videos/",
        json={
            "youtube_url": "https://youtube.com/watch?v=x",
            "recipe_id": "00000000-0000-0000-0000-000000000001",
            "submission_id": "00000000-0000-0000-0000-000000000002",
        },
        headers=_auth_header(token),
    )
    assert resp.status_code == 422
