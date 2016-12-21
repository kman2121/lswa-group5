from django.conf.urls import include, url

from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^home/$', views.home, name='home'),
    url(r'^friends/$', views.friendlist, name='friendlist'),
    url(r'^stream/(?P<user_id>[0-9]+)/$', views.stream, name='stream'),
    url(r'^image/(?P<image_id>.{36})/$', views.image, name='image'),
    url(r'^image/(?P<image_id>.{36})/tags$', views.tags, name='tags'),
    url(r'^post/$', views.post, name='post'),
    url(r'^follow/$', views.follow, name='follow'),
    url(r'^upload/$', views.upload, name='upload'),
    url(r'^register/$', views.register, name='register'),
    url('^', include('django.contrib.auth.urls'))
]
