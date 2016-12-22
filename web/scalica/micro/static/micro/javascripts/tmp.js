document.addEventListener("DOMContentLoaded", function(event) {
  var items = document.getElementsByClassName("tagcontainer");
  for( var i = 0; i < items.length; i++ ){
    (function(i){
        items[i].addEventListener('mouseover', function(event) {
            reveal(items[i].id);
        }, false);
        items[i].addEventListener('mouseout', function(event) {
            hide(items[i].id);
        }, false);
        items[i].addEventListener('click', function(event) {
            console.log(this.childNodes);
        }, false);
    })(i);
  }

  function reveal(id) {
      document.getElementById(id).style.borderStyle ="solid";
  }

  function hide(id) {
          document.getElementById(id).style.borderStyle = "hidden";

  }
});
