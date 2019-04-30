function deletePost() {
    if (!confirm('Are you sure?')) { return false }
  }

  $('#_status > option').click(function(e){
    $('#_status > option').removeClass('selected');
    $(this).addClass('selected'); 
});