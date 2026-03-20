import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from src.db.base import Base
from src.models.enums import WorkshopRegistrationStatus, VolunteerApplicationStatus, ContactRequestStatus

class Workshop(Base):
    __tablename__ = "workshops"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    scheduled_at = Column(DateTime)
    capacity = Column(Integer)
    location = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class WorkshopRegistration(Base):
    __tablename__ = "workshop_registrations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workshop_id = Column(UUID(as_uuid=True), ForeignKey("workshops.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(SQLEnum(WorkshopRegistrationStatus), default=WorkshopRegistrationStatus.CONFIRMED)
    registered_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class VolunteerApplication(Base):
    __tablename__ = "volunteer_applications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    application_text = Column(Text)
    status = Column(SQLEnum(VolunteerApplicationStatus), default=VolunteerApplicationStatus.PENDING)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class ContactRequest(Base):
    __tablename__ = "contact_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(SQLEnum(ContactRequestStatus), default=ContactRequestStatus.UNREAD)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
