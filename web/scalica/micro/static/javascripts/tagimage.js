document.addEventListener('DOMContentLoaded', function(event){
  var tgpg = document.getElementById('tagpage');
  var prompt = tagMePrompt();
  var hasFace = false;
  if (hasFace){
    prompt.childNodes[0].innerHTML = "Face detected! Would you like to tag the image?";
  }
  else{
    prompt.childNodes[0].innerHTML = "No face detected! Would you still like to tag the image?";
  }
  tgpg.appendChild(prompt);
  document.getElementById("yesBtn").addEventListener('click', generateTag);

});

var friendDict = ['Bob', 'Billy', 'Betty', 'Anthony', 'Betsy', 'Bill'];

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
  no.setAttribute('href', '/home');
  no.innerHTML = "No";
  noBtn.appendChild(no);
  prompt.appendChild(noBtn);
  return prompt;
}


function generateTag(event){
  /*As soon as the user wants to tag someone
  return a list of their friends that can be accessed
  and eventually used to tag friends */

  //var req = new XMLHTTPRequest();
  //req.open('GET', '/api/userfriends', true);
  //req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //req.send(userid);?
  document.getElementById('yesBtn').classList.toggle("clicked");
  console.log("clicked yes");
  document.getElementById('tagMePrompt').style.visibility = 'hidden';

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
  tagLabel.innerHTML = "Tag a friend";

  form.appendChild(tagLabel);
  form.appendChild(tagBox);
  /*form.setAttribute("action", "");
  form.setAttribute("method", "");*/
  tagger.appendChild(form);

  document.getElementById('tagpage').appendChild(tagger);
  tagBox.addEventListener("change", findFriends);


}

function findFriends(event){
  console.log("Finding friends");
  //access friends list and generate click-able list of first five
  //whose names begin with the currently entered text
  var inputTag = document.getElementById('tag');
  var findFriendKey = inputTag.value;
  console.log(findFriendKey);

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
}

function tagPhoto(event){
  console.log("clicked to tag");
  //AJAX post to tag photo
  //once the tag has been successful update the
  //image to display the tag also
}


/*
function createBox(coordArr, imgIdr){
  var box = document.createElement('div');
  box.id = ''+imgIdr;

}
*/
