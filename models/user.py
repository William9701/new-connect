from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime, Table, Column, Integer, ForeignKey
from hashlib import md5

from models.base_models import Basemodels, Base
import sqlalchemy
from sqlalchemy import Column, String, ForeignKey, Integer
import models
from models.content import Content
from models.comment import Comment
from sqlalchemy.orm import relationship, Session
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()


# Association table for many-to-many relationship between User instances
subscriptions = Table('subscriptions', Base.metadata,
                      Column('subscriber_id', String(
                          60), ForeignKey('users.id')),
                      Column('subscribed_id', String(
                          60), ForeignKey('users.id'))
                      )


class User(Basemodels, Base):
    __tablename__ = 'users'
    if models.storage_t == "db":
        # Existing columns...
        id = Column(String(60), primary_key=True)
        created_at = Column(DateTime, default=datetime.utcnow)
        updated_at = Column(DateTime, default=datetime.utcnow)
        email = Column(String(128), unique=True, nullable=False)
        username = Column(String(128), unique=True, nullable=False)
        password = Column(String(128), nullable=False)
        first_name = Column(String(128), nullable=False)
        last_name = Column(String(128), nullable=False)
        image = Column(String(128), nullable=False, default='../static/images/user.png')
        location = Column(String(128), nullable=False)
        description = Column(String(1024), nullable=False)
        contents = relationship("Content", backref="user",
                                cascade="all, delete, delete-orphan")
        comments = relationship("Comment", backref="user",
                                cascade="all, delete, delete-orphan")

        # New relationships for subscriptions
        subscribed = relationship(
            "User",
            secondary=subscriptions,
            primaryjoin=(subscriptions.c.subscriber_id == id),
            secondaryjoin=(subscriptions.c.subscribed_id == id),
            backref="subscribers",
            lazy="dynamic",
            viewonly=False
        )

    else:
        first_name = ""
        last_name = ""
        email = ""
        password = ""
        location = ""
        description = ""

    

    def __setattr__(self, name, value):
        """sets a password with md5 encryption"""
        if name == "password":
            value = bcrypt.generate_password_hash(value).decode('utf-8')
        if name == "username":
            if not value.startswith("@"):
                value = f"@{value}"
        super().__setattr__(name, value)
