document.addEventListener('DOMContentLoaded', function(event){
  var tgpg = document.getElementById('tagPage');
  var prompt = tagMePrompt();
  var hasFace = false;
  if (hasFace){
    prompt.innerHTML = "Face detected! Would you like to tag the image?";
  }
  else{
    prompt.innerHTML = "No face detected! Would you still like to tag the image?";
  }
  tgpg.appendChild(prompt);
  var yesTag = document.getElementById('yesBtn');
  yesTag.addEventListener('click', generateTag());

});




function tagMePrompt(){
  var prompt = document.createElement('div');
  prompt.id = "tagMePrompt";
  var yesBtn = document.createElement('button');
  yesBtn.id = 'yesBtn';
  prompt.appendChild(yesBtn);
  return prompt;
}

function generateTag(event){

  var tagger = document.createElement('div');
  var form = document.createElement('form');
}


/*
function createBox(coordArr, imgIdr){
  var box = document.createElement('div');
  box.id = ''+imgIdr;

}
*/
