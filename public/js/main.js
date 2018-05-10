$(document).ready(function(){
  $('.delete-temperature').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/temperatures/'+id,
      success: function(response){
        alert('Está a apagar temperatura.');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
