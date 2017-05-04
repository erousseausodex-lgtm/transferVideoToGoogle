$(function() {
  $.get('/getData', function(datum) {
    $('<li></li>').text(datum[0]).appendTo('p#deets');
    $('<li></li>').text(datum[1]).appendTo('p#deets');
  });
});