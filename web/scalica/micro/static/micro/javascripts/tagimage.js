document.addEventListener('DOMContentLoaded', function(event){
  var tgpg = document.getElementById('tagpage');
  var prompt = tagMePrompt();
  var hasFaces = document.getElementById('img-page-pic').classList.contains('has_faces');
  if(hasFaces){
    prompt.childNodes[0].innerHTML = "Face detected! Would you like to tag the image?";
  }
  else{
    prompt.childNodes[0].innerHTML = "No face detected! Would you still like to tag the image?";
  }
  tgpg.appendChild(prompt);
  document.getElementById("yesBtn").addEventListener('click', generateTag);
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
              var fixme = document.getElementById('tagged-list');
              while(fixme.childNodes[0]){
                fixme.removeChild(fixme.childNodes[0]);
              }
              var resText = JSON.parse(this.responseText);
              var replace = document.createElement("ul");
              for(taggy in resText){
                var curAdditionText = resText[taggy];
                var curAddition = document.createElement("li");
                curAddtion.innerHTML = curAdditionText;
                replace.appendChild(curAddtion);
              }
              fixme.appendChild(replace);
          }
      });
      req.send(content);
    }
  });
}


function generateTag(event){
  /*As soon as the user wants to tag someone
  return a list of their friends that can be accessed
  and eventually used to tag friends */
/*
  var reqFriends = new XMLHttpRequest();
  reqFriends.open('GET', '/api/userfriends', true);
  //req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  reqFriends.addEventListener('load', updateFriendsList);
  reqFriends.send();
  console.log("clicked yes");
  document.getElementById('tagMePrompt').style.visibility = 'hidden';*/



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

  document.getElementById('tagpage').appendChild(tagger);
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

/*function findFriends(event){
  console.log("Finding friends");
  //access friends list and generate click-able list of first five
  //whose names begin with the currently entered text

  //get current input
  var inputTag = document.getElementById('tag');
  var findFriendKey = inputTag.value;
  console.log(findFriendKey);
  //collect list of friends whose name matches current query
  var suggested = friendDict.filter(function(ele){
    var l = findFriendKey.length;
    if(ele.substring(0,l) === findFriendKey){
      console.log(ele+" found true");
      return true;
    }
    else{
      console.log(ele+" found false");
      return false;
    }
  });
  console.log(suggested);
  //reset display
  if(document.getElementById("notFound")){
    (document.getElementById("notFound")).style.display = 'none';
  }

  if(document.getElementById('suggestedFriends')){
    var clearMe = document.getElementById('suggestedFriends');
    while(clearMe.childNodes[0]){
      clearMe.removeChild(clearMe.childNodes[0]);
    }
    var ul = document.getElementById('suggestedFriends');
  }
  else{
    var ul = document.createElement('ul');
    ul.id = "suggestedFriends";
    document.getElementById('tagpage').appendChild(ul);
  }

  //display first five friends whose name matches current query
  var tracker = 0;
  for(var i = 0; i < 5; i++){
    console.log("creating buttons");
    if(suggested[i]){
      console.log(suggested[i]);
      tracker ++;
      var curEle = document.createElement('li');
      var curBtn = document.createElement('button');
      curEle.appendChild(curBtn);
      curBtn.id = suggested[i];
      curBtn.innerHTML = suggested[i];
      curBtn.addEventListener('click', tagPhoto);
      ul.appendChild(curEle);
    }
    else{
      break;
    }
  }
  //if no friends match the current query then prompt the user to change tag
  console.log(suggested.length);
  if (suggested.length === 0){
    if(document.getElementById("notFound")){
      document.getElementById("notFound").style.display = 'block';
    }
    else{
      var notFound = document.createElement('div');
      notFound.id = "notFound";
      notFound.innerHTML = "Hmm... it seems you have no friends by that name";
      document.getElementById('tagpage').appendChild(notFound);
    }
  }
}*/

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

/*function updateFriendsList(){
  if(this.status >= 200 && this.status < 400){
    var friends = JSON.parse(this.responseText);
    for (friend in friends){
      friendDict.append(friends[friend]);
    }
  }
}*/
