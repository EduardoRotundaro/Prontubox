var pacienteId;
var medicoId;
var numProntuario;

$(document).ready(function() {

  $("#botaoOk").attr("disabled", "");

  $.ajax({
    url: 'http://localhost:5000/prontubox/getSessionData', type: 'GET'
  })
  .done(function(msg){
    medicoId = msg[0].identificador;
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

  $.ajax({
    url: 'http://localhost:5000/prontubox/countProntuario', type: 'GET'
  })
  .done(function(msg){
    numProntuario = msg[0].quant;
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

});

function procurar(){

  $("#botaoOk").attr("disabled", "");

  if($("#pacienteCpf").val()=="" ){
    $("#pacienteResultado").html("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Insira um CPF no campo acima.</div>");
    return;
  }

  var field = $("#pacienteCpf").val();
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
      $("#pacienteResultado").html("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Nenhum resultado!</strong> Verifique o CPF digitado.</div>");
    }
    else{
      $("#botaoOk").removeAttr("disabled");

      $("#pacienteResultado").html("<div id=\"accordion\"><div class=\"card\"><div id=\"cartao\" class=\"card-header\"><a class=\"card-link\" data-toggle=\"collapse\" href=\"#collapseOne\"><b>" + msg[0].pacienteNome +"</b></a></div><div id=\"collapseOne\" class=\"collapse\" data-parent=\"#accordion\"><div class=\"card-body\"><b>Data de nascimento: </b>" + msg[0].pacienteDataNascimento + "<br><b>Origem: </b>" + msg[0].pacienteCidade + ' - ' +  msg[0].pacienteEstado + "</div></div></div></div>");

      pacienteId = msg[0].idpaciente;

    }
  })
  .fail(function(jqXHR, textStatus, msg){
    console.log(msg);
    alert("Ocorreu um erro interno!");
  });

}

function novoProntuario(){

  $(".alert").remove();

  if($("#prontuarioData").val()=="" || $("#prontuarioDiagnostico").val()=="" ){
    if($("#prontuarioData").val()=="") { $("#dataField").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Selecione a data.</div>"); }
    if($("#prontuarioDiagnostico").val()=="") { $("#prontuarioDiagnostico").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Esse campo não pode ficar em branco.</div>"); }
    return;
  }

  $("#aviso").remove();

  $.ajax({
    url: 'http://localhost:5000/prontubox/newProntuario',
    type: 'POST',
    dataType: 'json',
    data: {
      medico: medicoId,
    	paciente: pacienteId,
    	data: $("#prontuarioData").val(),
    	prontuarioId: numProntuario + 1,
    	diag:$("#prontuarioDiagnostico").val()
    }
  })
  .done(function(msg){
    $("#botaoOk").attr("disabled", "");
    $("#botao").attr("disabled", "");
    $("#botaoC").html("Voltar");
    $("#botoes").after("<div id=\"aviso\" class=\"alert alert-success\"><strong>Prontuário cadastrado com sucesso! </strong><a href=\"../home-medico/index.html\" class=\"alert-link\">Ok</a>.</div>");
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

}
