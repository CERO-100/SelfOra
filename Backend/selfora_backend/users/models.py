from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Extra fields if you want, for now just email and username are enough
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
