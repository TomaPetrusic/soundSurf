from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class Node(Base):
   __tablename__ = "nodes"

   id = Column(Integer, primary_key=True, index=True)
   name = Column(String, nullable=False)
   type = Column(String, nullable=False)
   user_id = Column(Integer, nullable=False, index=True)
   parent_id=Column(Integer, ForeignKey("nodes.id", ondelete="CASCADE"), nullable=True)

   format = Column(String, nullable=False)
   storage_key = Column(String, nullable=False)

   created_at = Column(DateTime(timezone=True), server_default=func.now())
   updated_at = Column(DateTime(timezone=True), onupdate=func.now())

   children = relationship(
      "Node",
      backref="parent",
      remote_side=[id],
      cascade="all, delete-orphan",
      passive_deletes=True
   )

   __table_args__ = (UniqueConstraint('user_id', 'parent_id', 'name', name='user_parent_name_uc'),)