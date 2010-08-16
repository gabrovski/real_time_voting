# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
import real_time_voting.mainapp.models
import datetime
import re

#helper function for view_results
#serilizes the votes in a delimited string in the format
#reuqired by the google charts api
#currently filters users by name to ease testing
#format of a single entry is (date, weight#user#descriptionofuser#weight2#user2#....)
def splitUser(votes, users, delim):
    usersbook = dict()
    i = 0
    for u in users:
        if str(u.name) not in usersbook: #this should be ip in the final version
            usersbook[u.name] = i
            i = i + 1

    #initialize array of entries
    #each user get 3 entries - weight user(name) description(ip^age^gender)
    num_usr = len(users)
    array = [''] + num_usr*['undefined','undefined','undefined']
    split = []
    for v in votes:
        array[0] = str(v.timestamp)
        curr_user = v.user
        k = 3*usersbook[curr_user.name]+1
        array[k] = str(v.weight)
        array[k+1] = curr_user.name
        array[k+2] = curr_user.ip_address+'^'+str(curr_user.age)+'^'+curr_user.gender
        split.insert(0, delim.join(array))
        array = [''] + num_usr*['undefined','undefined','undefined']

    return split

    
def get_user_or_create(ip_address):
    try:
        user = real_time_voting.mainapp.models.User.objects.get(ip_address=ip_address)
    except real_time_voting.mainapp.models.User.DoesNotExist:
        print "making a new user" # NOTE: DEBUG
        # make a new user
        user = real_time_voting.mainapp.models.User(ip_address=ip_address)
        user.save()
    return user
        

def main(request):
    # get all events from db
    events = real_time_voting.mainapp.models.Event.objects.all()
    
    return render_to_response('index.html', {'events': events})


def create_event(request):
    return render_to_response('create_event.html', {})

def view_results(request, event__pk):
    votes = real_time_voting.mainapp.models.Vote.objects.order_by('timestamp').filter(timestamp__isnull=False).filter(event__pk=event__pk).reverse()
    event = real_time_voting.mainapp.models.Event.objects.get(pk=event__pk)
    users = real_time_voting.mainapp.models.User.objects.all()
    
    #convert timestamps to a format understandable by Google Charts
    #creates a list of lists of the splitted timestamp string and the vote object
    #uses list.insert(i, x) since list.append is a O(x^2) algo
    timestamp_votes = []
    for v in votes:
        timestamp_votes.insert(0,  [re.split('[- :\.]', str(v.timestamp)),v]  )

    split_stamps = splitUser(votes, users, '#')
    
    #some stuff here is obsolete. will lcean up once i get it working
    return render_to_response('results.html', {'successful_vote': True, 'timestamp_votes': timestamp_votes, 'event': event, 'votes': votes, 'split_stamps': split_stamps})

def create_event_do(request):
    name = request.POST['name']
    description = request.POST['description']
    newevent = real_time_voting.mainapp.models.Event(name=name, description=description)
    newevent.save()
    #url_to_redirect_to = reverse(real_time_voting.mainapp.views.event) + "/" + newevent.pk
    url_to_redirect_to = "event/" + str(newevent.pk)
    return HttpResponseRedirect(url_to_redirect_to)

def event(request, event__pk):
    event = real_time_voting.mainapp.models.Event.objects.get(pk=event__pk)
    user = get_user_or_create(request.META.get('REMOTE_ADDR'))
    her_num_votes = len(real_time_voting.mainapp.models.Vote.objects.all().filter(user=user).filter(event=event))
    return render_to_response('event.html', {'event': event, 'user': user, 'her_num_votes': her_num_votes})

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
