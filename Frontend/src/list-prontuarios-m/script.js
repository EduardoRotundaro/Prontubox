var dataP;
var diag;
var patientId;

$(document).ready(function() {

  $.ajax({ url: 'http://localhost:5000/prontubox/getSessionData', type: 'GET' })
  .done(function(msg){
    $.ajax({
        url: 'http://localhost:5000/prontubox/listProntuarioM',
        type: 'POST',
        dataType: 'json',
        data: {
          id: msg[0].identificador
        }
    })
    .done(function(msg){
      if(msg.length==0){
        $("#campoderesultado").html("<div id=\"aviso\" class=\"alert alert-warning\"><strong>Nada!</strong> Você ainda não cadastrou nenhum prontuário.</div>");
      }
      else{

        $("#campoderesultado").append("<div id=\"accordion\"></div>");

        var x = 1;
        $.each(msg, function() {
          $("#accordion").append("<div class=\"card\"><div id=\"cartao\" class=\"card-header\"><a class=\"card-link\" data-toggle=\"collapse\" href=\"#collapse" + x +"\"><b>" + this.prontuarioData +"</b></a></div><div id=\"collapse" + x + "\" class=\"collapse\" data-parent=\"#accordion\"><div class=\"card-body\"><b>Paciente: </b>" + this.pacienteNome + "<br><b>Diagnóstico: </b>" + this.prontuarioDiagnostico + "</div></div></div>");
          x = x + 1;
        })

      }
    })
    .fail(function(jqXHR, textStatus, msg){
      console.log(msg);
      alert("Ocorreu um erro interno!");
    });
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

});
