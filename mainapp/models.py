from django.db import models


class Event(models.Model):
    name = models.CharField(max_length=81)
    description = models.CharField(max_length=500)

class User(models.Model):
    age = models.IntegerField(null=True)
    name = models.CharField(max_length=100, null=True)
    gender = models.CharField(max_length=100, null=True)
    ip_address = models.CharField(max_length=100, null=False, editable=False)

class Vote(models.Model):
    event = models.ForeignKey(Event)
    timestamp = models.DateTimeField('date voted')
    weight = models.IntegerField()
    user = models.ForeignKey(User)
