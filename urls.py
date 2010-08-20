from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^$', 'real_time_voting.mainapp.views.main'),
    #(r'^vote_success$', 'real_time_voting.mainapp.views.vote_success'),
    (r'^create_event$', 'real_time_voting.mainapp.views.create_event'),

    (r'^view_results/(?P<event__pk>\d+)$', 'real_time_voting.mainapp.views.view_results'),
    (r'^event/(?P<event__pk>\d+)$', 'real_time_voting.mainapp.views.event'),

    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
                {'document_root': settings.STATIC_DOC_ROOT, 'show_indexes': True}),


    # form handlers
    # let's end the url for all form handlers (which take data from post) with "_do"
    (r'^process_vote_do$', 'real_time_voting.mainapp.views.process_vote_do'),
    (r'^process_vote_json$', 'real_time_voting.mainapp.views.process_vote_json'),
    (r'^process_user_do$', 'real_time_voting.mainapp.views.process_user_do'),
    (r'^create_event_do$', 'real_time_voting.mainapp.views.create_event_do'), 
    # to enable django's built-in admin thing:
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),
)
