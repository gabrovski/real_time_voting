from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^$', 'real_time_voting.mainapp.views.main'),
    (r'^vote_success/$', 'real_time_voting.mainapp.views.vote_success'),

    # form handlers
    # let's end the url for all form handlers (which take data from post) with "_do"
    (r'^process_vote_do$', 'real_time_voting.mainapp.views.process_vote_do'),

    # to enable django's built-in admin thing:
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),
)
