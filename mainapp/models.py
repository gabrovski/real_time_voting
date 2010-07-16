from django.db import models

class Vote(models.Model):
    timestamp = models.DateTimeField('date voted')
    ip_address = models.CharField(max_length=200)
    weight = models.IntegerField()

