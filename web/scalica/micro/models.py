from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.conf import settings

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.forms import ModelForm, TextInput, FileInput

import uuid

# Helper functions

def uuidGen():
    x = uuid.uuid4()
    while True:
        try:
            Post.objects.get(id = x)
            x = uuid.uuid4()
        except Post.DoesNotExist:
            return x

# upload_to path determination
def profile_pic_path(instance, filename):
    return 'images/profiles/{0}.png'.format(instance.user.id)
def pic_path(instance, filename):
    # TODO: figure out how we want to format this
    # have to change the filename...what if the user tries posting something else with the same filename
    return 'images/uploads/{0}/{1}'.format(instance.user.username, filename)


# Models
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE,
                                related_name='profile')

    # TODO: make sure that on upload this is scaled down to a specified size
    # Default pic is 128*128...maybe use that
    profile_picture = models.ImageField(upload_to=profile_pic_path,
                                        default='images/profiles/user.png')

class Post(models.Model):
  user = models.ForeignKey(settings.AUTH_USER_MODEL)
  text = models.CharField(max_length=256, default="")
  pub_date = models.DateTimeField('date_posted')
  image = models.ImageField(upload_to=pic_path, null=True)
  has_faces = models.BooleanField(default=False)
  id = models.UUIDField(primary_key=True, default=uuidGen, editable=False)

  def __str__(self):
    if len(self.text) < 16:
      desc = self.text
    else:
      desc = self.text[0:16]
    return self.user.username + ':' + desc

class Tag(models.Model):
    x = models.IntegerField()
    y = models.IntegerField()
    height = models.IntegerField()
    width = models.IntegerField()
    post = models.ForeignKey(Post, related_name = 'tags')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'tagged_posts', null=True, on_delete = models.SET_NULL)

    @classmethod
    def create(cls, post, x, y, w, h, user):
        if(not user == None):
            book = cls(post=post, x=x, y=y, width=w, height=h, user=user)
        else:
            book = cls(post=post, x=x, y=y, width=w, height=h, user=null)
        return book

class Following(models.Model):
  follower = models.ForeignKey(settings.AUTH_USER_MODEL,
                               related_name="user_follows")
  followee = models.ForeignKey(settings.AUTH_USER_MODEL,
                               related_name="user_followed")
  follow_date = models.DateTimeField('follow date')
  def __str__(self):
    return self.follower.user.username + "->" + self.followee.user.username


# Profile creation/update functions
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile.objects.create(id=instance.id, user=instance)
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


# Model Forms
class PostForm(ModelForm):
  class Meta:
    model = Post
    fields = ('text',)
    widgets = {
      'text': TextInput(attrs={'id' : 'input_post'}),
    }

class ImageUploadForm(ModelForm):
    class Meta:
        model = Post
        fields = ('image', 'text')
        widgets = {
          'image': FileInput(attrs={'accept': 'image/gif, image/jpeg, image/png, image/bmp, image/', 'value': 'Select Image'}),
        }

class FollowingForm(ModelForm):
  class Meta:
    model = Following
    fields = ('followee',)

class MyUserCreationForm(UserCreationForm):
  class Meta(UserCreationForm.Meta):
    help_texts = {
      'username' : '',
    }
