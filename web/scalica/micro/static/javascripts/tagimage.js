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
  tagLabel.innerHTML = "Tag a friend ";

  form.appendChild(tagLabel);
  form.appendChild(tagBox);
  /*form.setAttribute("action", "");
  form.setAttribute("method", "");*/
  tagger.appendChild(form);

  document.getElementById('tagpage').appendChild(tagger);
  tagBox.addEventListener("change", findFriends);

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


}

function findFriends(event){
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
}

function beginAgain(eve){
  var restart = document.getElementById('tagpage');
  while(restart.childNodes[0]){
    restart.removeChild(restart.childNodes[0]);
  }
  var prompt = tagMePrompt();
  prompt.childNodes[0].innerHTML = "Tag cancelled. Tag photo after all?"
  restart.appendChild(prompt);
}

function tagPhoto(event){

  //once the tag has been successful update the
  //image to display the tag and prompt for more tags
    console.log("create post is working!") // sanity check
    $.ajax({
        url : "create_post/", // the endpoint
        type : "POST", // http method
        data : { the_post : $('#post-text').val() }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#post-text').val(''); // remove the value from the input
            console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};

/*
function createBox(coordArr, imgIdr){
  var box = document.createElement('div');
  box.id = ''+imgIdr;

}
*/
