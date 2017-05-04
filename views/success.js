$(function() {
  $.get('/getData', function(datum) {
    if(datum=="An error occurred"){
      
    } else
    $('<span></span>').text("Oh, hi " + datum[0].name + "! I have that data for you: ").appendTo('p#deets');
    $('p#deets').prepend('<img src="'+ datum[0].photo +'" />')
    $('<div></div>').text(datum[1][1]).appendTo('p#deets');
  });
});