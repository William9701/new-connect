document.addEventListener("DOMContentLoaded", function () {
  var menuicon = document.querySelector(".menu-icon");
  var sidebar = document.querySelector(".sidebar");
  var sub_body = document.querySelector(".sub-body");

  menuicon.onclick = function () {
    sidebar.classList.toggle("small-sidebar");
    sub_body.classList.toggle("large-sub-body");
  };
});
