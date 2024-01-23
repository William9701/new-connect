import models
from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship


class ReplyComment(Basemodels, Base):
    __tablename__ = 'reply_comments'
    if models.storage_t == "db":
        user_id = Column(String(60), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
        comment_id = Column(String(60), ForeignKey('comments.id'), nullable=False)
        text = Column(String(1024), nullable=False)
    else:
        user_id = ""
        comment_id = ''
        text = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

