function deletePost() {
    if (!confirm('Are you sure?')) { return false }
  }


$(function(){
  var url = window.location.pathname, 
      urlRegExp = new RegExp(url.replace(/\/$/,'') + "$");         
      $('#navbarSupportedContent .navbar-nav a').each(function(){
        if ( window.location.pathname != '/' ){
          if(urlRegExp.test(this.href.replace(/\/$/,''))){
                $(this).addClass('active');
            } 
          }             
      });
});

$(function() {
  $('.select-episode').on('change', function() {
      $.cookie('select-episode', this.value);
  });
  $('.select-episode').val( $.cookie('select-episode') );
});

$(function() {
  $('#epNum').on('change', function() {
      $.cookie('epNum', this.value);
  });
  $('#epNum').val( $.cookie('epNum') );
});


$(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var result = url.searchParams.get("postId");

  $('#parent_post').val(result);
});

var csrf_token = $('meta[name="_csrf"]').attr('content');

$(function() {
  var body = $("body");
  var toggleButton = $("#themeToggle");
  if (toggleButton.length) {
    toggleButton.on("click", function (e) {
        e.preventDefault();

        body.toggleClass("dark-mode");
        var mode = "light-mode";
        $('link[title="dark-mode"]').remove();

        if(body.hasClass("dark-mode")) {
          mode = "dark-mode";
          body.removeClass("light-mode");
          $("<link>").attr({title: "dark-mode", href: "/css/dark.css", rel: "stylesheet", type: "text/css"}).appendTo('head');
        }

        $.ajax({
          type: 'POST',
          dataType: 'JSON',
          url: '/mode',
          cache: true,
          data:({
              mode: mode,
              _csrf: csrf_token
          }),
          success:function(results) {    
            console.log(results);    
          }

      });
    });

    if(body.hasClass("dark-mode")) {
      mode = "dark-mode";
      body.removeClass("light-mode");
      $("<link>").attr({title: "dark-mode", href: "/css/dark.css", rel: "stylesheet", type: "text/css"}).appendTo('head');
    } 

    }
});