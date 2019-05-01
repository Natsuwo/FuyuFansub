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