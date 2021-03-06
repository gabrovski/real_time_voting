# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.core import serializers
from django.utils import simplejson
import real_time_voting.mainapp.models
import datetime
import re


def get_user_or_create(ip_address):
    try:
        user = real_time_voting.mainapp.models.User.objects.get(ip_address=ip_address)
    except real_time_voting.mainapp.models.User.DoesNotExist:
        print "making a new user" # NOTE: DEBUG
        # make a new user
        default_age = 0
        default_gender = "Not Specified"
        default_name = "Anonymous"
        user = real_time_voting.mainapp.models.User(ip_address=ip_address, age=default_age, name=default_name, gender=default_gender)
        user.save()
    return user
        

def main(request):
    # get all events from db
    events = real_time_voting.mainapp.models.Event.objects.all()
    
    return render_to_response('index.html', {'events': events})


def create_event(request):
    return render_to_response('create_event.html', {})


# TODO: deprecated?
def view_results(request, event__pk):
    votes = real_time_voting.mainapp.models.Vote.objects.order_by('timestamp').filter(timestamp__isnull=False).filter(event__pk=event__pk).reverse()
    event = real_time_voting.mainapp.models.Event.objects.get(pk=event__pk)
    users = []
    for v in votes:
        if v.user not in users:
            users.append(v.user)

    # split_stamps = splitUser(votes, users, '#')

    
    return render_to_response('results.html', {'users':users, 'successful_vote': True, 'event': event, 'votes': votes})


def create_event_do(request):
    name = request.POST['name']
    description = request.POST['description']
    newevent = real_time_voting.mainapp.models.Event(name=name, description=description)

    # video stuff, before we save
    if request.POST['video_id']:
        newevent.has_video = True
        newevent.video_site_id = request.POST['video_id']
    else:
        newevent.has_video = False


    # okay, now save
    newevent.save()
    #url_to_redirect_to = reverse(real_time_voting.mainapp.views.event) + "/" + newevent.pk
    url_to_redirect_to = "event/" + str(newevent.pk)
    return HttpResponseRedirect(url_to_redirect_to)

def event(request, event__pk):
    votes = real_time_voting.mainapp.models.Vote.objects.order_by('timestamp').filter(timestamp__isnull=False).filter(event__pk=event__pk).order_by('relative_timestamp', 'timestamp')

    # grab all the users who have voted on this event
    users = []
    for v in votes:
        if v.user not in users:
            users.append(v.user)

    event = real_time_voting.mainapp.models.Event.objects.get(pk=event__pk)
    user = get_user_or_create(request.META.get('REMOTE_ADDR'))
    her_num_votes = len(real_time_voting.mainapp.models.Vote.objects.all().filter(user=user).filter(event=event))
    #return render_to_response('event.html', {'event': event, 'user': user, 'her_num_votes': her_num_votes})
    return render_to_response('event.html', {'event': event, 'user': user, 'her_num_votes': her_num_votes, 'users':users, 'successful_vote': True, 'votes': votes })

def process_vote_json(request):
    weight = request.GET.get("weight")
    event = real_time_voting.mainapp.models.Event.objects.get(pk=request.GET.get('event__pk'))
    user = get_user_or_create(request.META.get('REMOTE_ADDR'))
    try:
        relative_timestamp = int(float(request.GET.get("relative_timestamp")))
    except :
        relative_timestamp = 0
    newvote = real_time_voting.mainapp.models.Vote(weight=weight, timestamp=datetime.datetime.now(), event=event, user=user, relative_timestamp=relative_timestamp)
    newvote.save()

    her_num_votes = len(real_time_voting.mainapp.models.Vote.objects.all().filter(user=user).filter(event=event))
    response = { 'success': "true", 'times_voted': her_num_votes }
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')



def process_vote_do(request):
    weight = request.POST['weight']
    event = real_time_voting.mainapp.models.Event.objects.get(pk=request.POST['event__pk'])
    user = get_user_or_create(request.META.get('REMOTE_ADDR'))
    newvote = real_time_voting.mainapp.models.Vote(weight=weight, timestamp=datetime.datetime.now(), event=event, user = user)
    newvote.save()

    #url_to_redirect_to = reverse(real_time_voting.mainapp.views.vote_success)
    url_to_redirect_to = "event/" + str(event.pk)
    return HttpResponseRedirect(url_to_redirect_to)

def process_user_do(request):
    user = get_user_or_create(request.META.get('REMOTE_ADDR'))
    user.name = request.POST['name']
    user.age = request.POST['age']
    user.gender = request.POST['gender']
    user.save()
    from_event__pk = request.POST['from_event__pk']

#    url_to_redirect_to = reverse(real_time_voting.mainapp.views.event)
    url_to_redirect_to = "/event/%s" % from_event__pk
    return HttpResponseRedirect(url_to_redirect_to)
