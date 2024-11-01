function parallax_height() {
  var scroll_top = $(this).scrollTop();
  var header_height = $(".sample-header-section").outerHeight();
  
  $(".sample-section").css({ "margin-top": header_height });
  $(".sample-header").css({ height: header_height - scroll_top });
}

parallax_height();

$(window).on("scroll resize", function() {
  parallax_height();
});

function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
}
///
