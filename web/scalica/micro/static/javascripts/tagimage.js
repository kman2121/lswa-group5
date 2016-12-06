document.addEventListener('DOMContentLoaded', function(event){

  
});




function tagMePrompt(){
  var prompt = document.createElement('div');
  prompt.id = "tagMePrompt";
  prompt.innerHTML= "A face was detected in your image!\nWould you like to tag me?";
  var yesBtn = document.createElement('button');
  yesBtn.id = 'yesBtn';
  prompt.appendChild(yesBtn);
}


function createBox(coordArr, imgIdr){
  var box = document.createElement('div');
  box.id = ''+imgIdr;

}
