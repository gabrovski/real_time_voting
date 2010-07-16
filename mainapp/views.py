# Create your views here.
from django.shortcuts import render_to_response
from django.http import HttpResponse

def main(request):
    return render_to_response('index.html', {})
