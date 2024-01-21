#!/usr/bin/python3
""" This is the content class """
from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, Enum, String, ForeignKey, Integer, UniqueConstraint
import models
from sqlalchemy.orm import relationship

class CommentReaction(Basemodels, Base):
    __tablename__ = 'comment_reactions'
    if models.storage_t == "db":
        user_id = Column(String(60), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
        comment_id = Column(String(60), ForeignKey('comments.id', ondelete='CASCADE'), nullable=False)
        reaction = Column(Enum('like', 'dislike'), nullable=False)
        __table_args__ = (UniqueConstraint('user_id', 'comment_id', name='user_comment_reaction'),)
    else:
        user_id = ""
        content_id = ""
        comment_id = ""
        reaction = ""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
