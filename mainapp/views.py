# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
import real_time_voting.mainapp.models
import datetime



def main(request):
    # get all events from db
    events = real_time_voting.mainapp.models.Event.objects.all()
    
    return render_to_response('index.html', {'events': events})


def create_event(request):
    return render_to_response('create_event.html', {})

def vote_success(request):
    votes = real_time_voting.mainapp.models.Vote.objects.order_by('timestamp').filter(timestamp__isnull=False).reverse()
    return render_to_response('voting_success.html', {'successful_vote': True, 'votes': votes})

def create_event_do(request):
    name = request.POST['name']
    description = request.POST['description']
    newevent = real_time_voting.mainapp.models.Event(name=name, description=description)
    newevent.save()
#    return render_to_response('voting_success.html', {})
    url_to_redirect_to = reverse(real_time_voting.mainapp.views.event_creation_success)
    return HttpResponseRedirect(url_to_redirect_to)

def event(request, event_id):
    event = real_time_voting.mainapp.models.Event.objects.get(pk=event_id)
    return render_to_response('event.html', {'event': event})
    

def process_vote_do(request):
    weight = request.POST['weight']
    newvote = real_time_voting.mainapp.models.Vote(weight=weight, timestamp=datetime.datetime.now(), ip_address=request.META.get('REMOTE_ADDR'))
    newvote.save()

    url_to_redirect_to = reverse(real_time_voting.mainapp.views.vote_success)
    return HttpResponseRedirect(url_to_redirect_to)

def process_user_do(request):
    name = request.POST['name']
    age = request.POST['age']
    gender = request.POST['gender']

    newuser = real_time_voting.mainapp.models.User(name=name, age=age, gender=gender, ip_address=request.META.get('REMOTE_ADDR'))
    newuser.save()

    url_to_redirect_to = reverse(real_time_voting.mainapp.views.vote_success)
    return HttpResponseRedirect(url_to_redirect_to)

