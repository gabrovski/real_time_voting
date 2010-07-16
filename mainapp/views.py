# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
import real_time_voting.mainapp.models

def main(request):
    return render_to_response('index.html', {})

def vote_success(request):
    return render_to_response('voting_success.html', {'successful_vote': True})

def process_vote_do(request):
    weight = request.POST['weight']
    newvote = real_time_voting.mainapp.models.Vote(weight=weight)
    newvote.save()

    url_to_redirect_to = reverse(real_time_voting.mainapp.views.vote_success)
    return HttpResponseRedirect(url_to_redirect_to)

