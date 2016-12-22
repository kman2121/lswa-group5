document.addEventListener('DOMContentLoaded', function(event){
  var tgpg = document.getElementById('tagpage');
  var prompt = tagMePrompt();
  var tags;
  var hasFaces = document.getElementById('img-page-pic').classList.contains('has_faces');
  if(hasFaces){
    prompt.childNodes[0].innerHTML = "Face detected! Would you like to tag the image?";
  }
  else{
    prompt.childNodes[0].innerHTML = "No face detected! Would you still like to tag the image?";
  }
  tgpg.appendChild(prompt);
  document.getElementById("yesBtn").addEventListener('click', generateTag);
  getTags();
  var items = document.getElementsByClassName("tagbox");
  for( var i = 0; i < items.length; i++ ){
    (function(i){
        items[i].addEventListener('mouseover', function(event) {
            reveal(this);
        }, false);
        items[i].addEventListener('mouseout', function(event) {
            hide(this);
        }, false);
        items[i].addEventListener('click', function(event) {
            generateTag(null, this.parentNode.childNodes[3]);
        }, false);
    })(i);
  }

  function reveal(ele) {
      ele.style.borderStyle ="solid";
  }

  function hide(ele) {
        ele.style.borderStyle = "hidden";
  }
});


//Store friends of user
//var friendDict = [];

function tagMePrompt(){
  console.log('Generating prompt');
  var prompt = document.createElement('div');
  prompt.id = "tagMePrompt";
  var promptText = document.createElement('div');
  promptText.id ="tagMePromptText";
  var yesBtn = document.createElement('button');
  yesBtn.id = 'yesBtn';
  yesBtn.innerHTML='Yes';
  prompt.appendChild(promptText);
  prompt.appendChild(yesBtn);
  var noBtn = document.createElement('button');
  noBtn.id = 'noBtn';
  var no = document.createElement('a');
  no.setAttribute('href', '/micro');
  no.innerHTML = "No";
  noBtn.appendChild(no);
  prompt.appendChild(noBtn);
  return prompt;
}

function getFriends() {
  var reqFriends = new XMLHttpRequest();
  reqFriends.open('GET', '/micro/friends', true);
  //req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  reqFriends.addEventListener('load', dojustice);
  reqFriends.send();
}

function getTags() {
  var reqFriends = new XMLHttpRequest();
  reqFriends.open('GET', 'tags', true);
  reqFriends.addEventListener('load', function() {
    if(this.status >= 200 && this.status < 400){
      tags = JSON.parse(this.responseText);
      for(let i = 0; i < tags.length; i++) {
        if(tags.tags[i][1] == null) {
          console.log(tags.tags[i]);
        }
      }
    }
  });
  reqFriends.send();
}

function dojustice() {
  if(this.status >= 200 && this.status < 400){
    friendDict = []
    console.log(this.responseText);
    var friends = JSON.parse(this.responseText);
    console.log(friends)
    friends = friends['friends']
    console.log(friends)
    for (friend in friends){
      console.log(friends[friend]);
      friendDict.push(friends[friend]);
    }
  }
  $( "#tag" ).autocomplete({
    source: friendDict,
    select: function(event, ui) {
      var content = "the_tag="+ui.item.value;
      var req = new XMLHttpRequest();
      req.open("POST", "", true);
      req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      req.addEventListener('load', function(eve){
          if (this.status >= 200 && this.status < 400){
              var fixme = document.getElementById('taglist');
              while(fixme.childNodes[0]){
                fixme.removeChild(fixme.childNodes[0]);
              }
              var resText = JSON.parse(this.responseText);
              console.log(resText);
              for(taggy in resText['tags']){
                var curAdditionText = resText['tags'][taggy];
                var curAddition = document.createElement("li");
                curAddition.innerHTML = curAdditionText;
                fixme.appendChild(curAddition);
              }

          }
      });
      req.send(content);
    }
  });
}


function generateTag(event, ele){

  var tagger = document.createElement('div');
  tagger.id ="taggerformdiv";

  //var form = document.createElement('form');
  var form = document.createElement('div');
  form.id = "taggerform";
  var tagBox = document.createElement('input');
  tagBox.setAttribute('type', 'text');
  tagBox.setAttribute('name', 'tag');
  tagBox.id = "tag";
  var tagLabel = document.createElement('label');
  tagLabel.setAttribute('for', 'tag');
  tagLabel.innerHTML = "Tag a friend ";

  form.appendChild(tagLabel);
  form.appendChild(tagBox);
  tagger.appendChild(form);
  ele.appendChild(tagger);


  //tagBox.addEventListener("change", findFriends);

  var cancelBtn = document.getElementById('cancel');
  if(cancelBtn){
    cancelBtn.style.visibility = 'visible';
  }
  else{
    cancelBtn = document.createElement('button');
    cancelBtn.id = "cancel";
    cancelBtn.innerHTML = "cancel tag";
    document.getElementById('tagpage').appendChild(cancelBtn);
    cancelBtn.addEventListener('click', beginAgain);
  }
  getFriends()

}

function beginAgain(eve){
  var restart = document.getElementById('tagpage');
  while(restart.childNodes[0]){
    restart.removeChild(restart.childNodes[0]);
  }
  var prompt = tagMePrompt();
  prompt.childNodes[0].innerHTML = "Tag cancelled. Tag photo after all?"
  restart.appendChild(prompt);
  document.getElementById("yesBtn").addEventListener('click', generateTag);

}

function tagPhoto(event){
  var userToBeTagged = this.id;
  var url = document.querySelector('img').src;
  //once the tag has been successful update the
  //image to display the tag and prompt for more tags
    console.log("create post is working!") // sanity check
  //Send Http req with image url and username of the person to be tagged
    var req = new XMLHttpRequest();
    req.open("POST", "create_tag/", true);
     // http method
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.addEventListener('load', function(event){
      if (this.status >= 200 && this.status < 400){
        console.log(req.responseText); // log the returned json to the console
        console.log("success");
        //Should reload the page asking for another tag... could do
        //here or could redirect to the page again when creating the
        //tag
      }
      else{
        console.log("error");
      }
      });
    req.send( "the_tag="+userToBeTagged+"&"+
                 "the_image="+url); // data sent with the post request
};
