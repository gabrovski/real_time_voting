from django.forms import ModelForm
from real_time_voting.mainapp.models import User

class UserForm(ModelForm):
    class Meta:
        model = User
