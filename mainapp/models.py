from django.db import models

class Vote(models.Model):
    timestamp = models.DateTimeField('date voted')
    ip_address = models.CharField(max_length=200)
    weight = models.IntegerField()

class Event(models.Model):
    name = models.CharField(max_length=81)
    description = models.CharField(max_length=500)
 
   
#class User(models.Model):
#    ip_address = 

    
