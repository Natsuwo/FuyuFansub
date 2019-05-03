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