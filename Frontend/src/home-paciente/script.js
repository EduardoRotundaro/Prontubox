var session;

$(document).ready(function() {

  $.ajax({
    url: 'http://localhost:5000/prontubox/getSessionData', type: 'GET'
  })
  .done(function(msg){
    session = msg;
    $("#helloMsg").html("<h4><b>Olá</b>, " + session[0].nome + "</h4>");
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

});
