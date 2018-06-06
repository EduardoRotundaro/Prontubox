$(document).ready(function() {

});

var paciente;
var prontuarios;

function procurar(){

  $("#campoderesultado").empty();
  if($("#searchPaciente").val()=="" ){
    $("#campoderesultado").html("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Insira um CPF no campo acima.</div>");
    return;
  }

  $("#campoderesultado").empty();

  var field = $("#searchPaciente").val();
  $.ajax({
      url: 'http://localhost:5000/prontubox/searchPaciente',
      type: 'POST',
      dataType: 'json',
      data: {
        cpf: field
      }
  })
  .done(function(msg){
    if(msg.length==0){
      $("#campoderesultado").html("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Verifique o CPF digitado!</strong> Não foi encontrado nada.</div>");
    }
    else{
      $("#campoderesultado").html("<div id=\"accordionP\"><div class=\"card\"><div id=\"cartao\" class=\"card-header\"><a class=\"card-link\" data-toggle=\"collapse\" href=\"#collapseOne\"><b>" + msg[0].pacienteNome +"</b></a></div><div id=\"collapseOne\" class=\"collapse\" data-parent=\"#accordion\"><div class=\"card-body\"><b>Data de nascimento: </b>" + msg[0].pacienteDataNascimento + "<br><b>Origem: </b>" + msg[0].pacienteCidade + ' - ' +  msg[0].pacienteEstado + "</div></div></div></div>");
      $("#campoderesultado").append("<header id=\"prontuarios\"><b>Prontuários do paciente:</b></header>");

      paciente=msg;

      $.ajax({
          url: 'http://localhost:5000/prontubox/prontuariosPaciente',
          type: 'POST', dataType: 'json',
          data: { id: paciente[0].idpaciente }
      })
      .done(function(msg){
        if(msg.length==0){
          $("#campoderesultado").append("<header id=\"noProntuarios\">Não possui nenhum prontuário cadastrado.</header>");
        }
        else{
          prontuarios = msg;
          $("#campoderesultado").append("<div id=\"accordion2\"></div>");

          var x = 1;
          $.each(prontuarios, function() {
            var data = this.prontuarioData;
            var diag = this.prontuarioDiagnostico;
            var reg = this.medico_idmedico;

            $.ajax({
                url: 'http://localhost:5000/prontubox/getByIdMedico',
                type: 'POST', dataType: 'json',
                data: { id: reg }
            })
            .done(function(msg){
              $("#accordion2").append("<div class=\"card\"><div id=\"cartao\" class=\"card-header\"><a class=\"card-link\" data-toggle=\"collapse\" href=\"#collapse" + x +"\"><b>" + data +"</b></a></div><div id=\"collapse" + x + "\" class=\"collapse\" data-parent=\"#accordion\"><div class=\"card-body\"><b>Médico: </b>" + msg[0].medicoNome + "<br><b>Diagnóstico: </b>" + diag + "</div></div></div>");
              x = x + 1;
            })
            .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

          })

        }
      })
      .fail(function(jqXHR, textStatus, msg){
        console.log(msg);
        alert("Ocorreu um erro interno!");
      });

    }
  })
  .fail(function(jqXHR, textStatus, msg){
    console.log(msg);
    alert("Ocorreu um erro interno!");
  });

}
