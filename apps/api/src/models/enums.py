from enum import Enum

class RoleName(str, Enum):
    PUBLIC = "Public"
    REGISTERED_USER = "RegisteredUser"
    EDITOR_OSF = "EditorOSF"
    ADMIN = "Admin"

class RecipeStatus(str, Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    PUBLISHED = "published"

class SubmissionStatus(str, Enum):
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"

class VideoStatus(str, Enum):
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    PUBLISHED = "published"

class RecipeDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class RecipeSourceType(str, Enum):
    INTERNAL = "internal"
    USER_SUBMITTED = "user_submitted"

class WorkshopRegistrationStatus(str, Enum):
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"

class VolunteerApplicationStatus(str, Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class ContactRequestStatus(str, Enum):
    UNREAD = "unread"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
