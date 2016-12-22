document.addEventListener("DOMContentLoaded", function(event) {
  var items = document.getElementsByClassName("tagbox");
  for( var i = 0; i < items.length; i++ ){
    (function(i){
        items[i].addEventListener('mouseover', function(event) {
            reveal();
        }, false);
        items[i].addEventListener('mouseout', function(event) {
            hide();
        }, false);
        items[i].addEventListener('click', function(event) {
            console.log(this.childNodes);
        }, false);
    })(i);
  }

  function reveal(id) {
      this.style.borderStyle ="solid";
  }

  function hide(id) {
        this.style.borderStyle = "hidden";
  }
});
