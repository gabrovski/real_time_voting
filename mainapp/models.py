from django.db import models


class Event(models.Model):
    name = models.CharField(max_length=81)
    description = models.CharField(max_length=500)

class Vote(models.Model):
    event = models.ForeignKey(Event)
    timestamp = models.DateTimeField('date voted')
    ip_address = models.CharField(max_length=200)
    weight = models.IntegerField()
  
class User(models.Model):
    age = models.IntegerField(null=True)
    name = models.CharField(max_length=100, null=True)
    gender = models.CharField(max_length=100, null=True)
    ip_address = models.CharField(max_length=100, null=False)
    

    
