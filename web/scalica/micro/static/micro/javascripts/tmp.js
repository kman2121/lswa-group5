
document.addEventListener("DOMContentLoaded", function(event) {
  var list = document.getElementsByClassName('tagbox');
  for (var i = 0; i < list.length; i++) {
    list[i].addEventListener("mouseover", appear(list[i].id));
    list[i].addEventListener("mouseout", disappear(list[i].id));
  }
  
  function appear(id) {
    document.getElementById(id).style.visibility = 'visible';
  function disappear(id) {
    document.getElementById(id).style.visibility = 'hidden';
  }
});
