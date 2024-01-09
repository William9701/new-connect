#!/usr/bin/python3
""" This is the content class """
from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, Enum, String, ForeignKey, Integer, UniqueConstraint
import models
from sqlalchemy.orm import relationship

class Reaction(Basemodels, Base):
    __tablename__ = 'reactions'
    if models.storage_t == "db":
        user_id = Column(String(60), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
        content_id = Column(String(60), ForeignKey('contents.id', ondelete='CASCADE'), nullable=False)
        reaction = Column(Enum('like', 'dislike'), nullable=False)
        __table_args__ = (UniqueConstraint('user_id', 'content_id', name='user_content_reaction'),)
    else:
        user_id = ""
        content_id = ""
        reaction = ""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)