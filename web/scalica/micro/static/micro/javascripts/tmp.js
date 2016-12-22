document.addEventListener("DOMContentLoaded", function(event) {
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
            console.log(this.nextSibling);
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
