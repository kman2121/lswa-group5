from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from django.core.cache import cache

from .models import Following, Post
from .models import FollowingForm, ImageUploadForm, PostForm, MyUserCreationForm

import threading
import xmlrpclib
import Queue
import hashlib

cache.set('threads', 0)
cache.set('maxThreads', 20)
workQueue = Queue.Queue(0)
rpc = xmlrpclib.ServerProxy("http://localhost:8080")


# Anonymous views
#################
def index(request):
  if request.user.is_authenticated():
    return home(request)
  else:
    return anon_home(request)

def anon_home(request):
  return render(request, 'micro/public.html')

def stream(request, user_id):
  # See if to present a 'follow' button
  form = None
  if request.user.is_authenticated() and request.user.id != int(user_id):
    try:
      f = Following.objects.get(follower_id=request.user.id,
                                followee_id=user_id)
    except Following.DoesNotExist:
      form = FollowingForm
  user = User.objects.get(pk=user_id)
  post_list = Post.objects.filter(user_id=user_id).order_by('-pub_date')
  paginator = Paginator(post_list, 10)
  page = request.GET.get('page')
  try:
    posts = paginator.page(page)
  except PageNotAnInteger:
    # If page is not an integer, deliver first page.
    posts = paginator.page(1)
  except EmptyPage:
    # If page is out of range (e.g. 9999), deliver last page of results.
    posts = paginator.page(paginator.num_pages)
  context = {
    'posts' : posts,
    'stream_user' : user,
    'form' : form,
  }
  return render(request, 'micro/stream.html', context)

def register(request):
  if request.method == 'POST':
    form = MyUserCreationForm(request.POST)
    new_user = form.save(commit=True)
    # Log in that user.
    user = authenticate(username=new_user.username,
                        password=form.clean_password2())
    if user is not None:
      login(request, user)
    else:
      raise Exception
    return home(request)
  else:
    form = MyUserCreationForm
  return render(request, 'micro/register.html', {'form' : form})

# Authenticated views
#####################
@login_required
def home(request):
  '''List of recent posts by people I follow'''
  try:
    my_post = Post.objects.filter(user=request.user).order_by('-pub_date')[0]
  except IndexError:
    my_post = None
  follows = [o.followee_id for o in Following.objects.filter(
    follower_id=request.user.id)]
  follows.append(request.user.id)
  post_list = Post.objects.filter(
      user_id__in=follows).order_by('-pub_date')[0:10]
  print my_post.has_faces
  context = {
    'post_list': post_list,
    'my_post': my_post,
    'post_form' : PostForm,
    'image_upload_form': ImageUploadForm
  }
  return render(request, 'micro/home.html', context)

# Allows to post something and shows my most recent posts.
@login_required
def post(request):
  if request.method == 'POST':
    form = PostForm(request.POST)
    new_post = form.save(commit=False)
    new_post.user = request.user
    new_post.pub_date = timezone.now()
    new_post.save()
    return home(request)
  else:
    form = PostForm
  return render(request, 'micro/post.html', {'form' : form})

def image(request, image_id):
    if request.method == 'GET':
        try:
            image = Post.objects.get(id=image_id)
        except Post.DoesNotExist:
            # TODO: redirect to home
            return
        
        my_photo = False
        if request.user.is_authenticated() and request.user.id == image.user.id:
            my_photo = True
        image_url = image.image.url
        curr_user = request.user
        
        context = {
            'my_photo': my_photo,
            'image_url': image_url,
            'user': curr_user
        }
        
        return render(request, 'micro/image.html', context)
    else:
        # TODO: redirect to home
        return

@login_required
def follow(request):
  if request.method == 'POST':
    form = FollowingForm(request.POST)
    new_follow = form.save(commit=False)
    new_follow.follower = request.user
    new_follow.follow_date = timezone.now()
    new_follow.save()
    return home(request)
  else:
    form = FollowingForm
  return render(request, 'micro/follow.html', {'form' : form})

@login_required
def upload(request):
    if request.method == 'POST':
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            new_pic = form.save(commit=False)
            new_pic.user = request.user
            new_pic.pub_date = timezone.now()
            new_pic.save()
            if(cache.get('threads') < cache.get('maxThreads')):
                image_thread = ImageProcessingThread(new_pic.id, workQueue)
                image_thread.start()
                print 'started thread'
                cache.incr('threads')
            else:
                print cache.get('threads')
                print cache.get('maxThreads')
                print 'queued'
                workQueue.put(new_pic.id)
            return redirect("/micro")
    else:
        form = ImageUploadForm()
    return render(request, 'micro/upload.html', {'form': form})

def processPicture(pic_id, q):
    pic = Post.objects.get(id=pic_id)
    faceArr = rpc.face(pic.image.path)
    print 'called rpc'
    if type(faceArr) is list and len(faceArr) > 0:
        pic.has_faces = True
        print 'face detected'
        # for now, just throwing out the array

    pic.save()

    print 'checking q'
    while(not q.empty()):
        pic_id = q.get()
        pic = Picture.objects.get(id=pic_id)
        faceArr = rpc.face(pic.image.path)
        if type(faceArr) is list and len(faceArr) > 0:
            pic.has_faces = True
            # for now, just throwing out the array

        pic.save()


class ImageProcessingThread(threading.Thread):
    def __init__(self, image_id, q, *args, **kwargs):
        self.image_id = image_id
        self.q = q
        super(ImageProcessingThread, self).__init__(*args, **kwargs)

    def run(self):
        print 'processing'
        processPicture(self.image_id, self.q)
        print 'processed'
        cache.decr('threads')
