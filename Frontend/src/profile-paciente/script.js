var dados;

$(document).ready(function() {

  $.ajax({
    url: 'http://localhost:5000/prontubox/getSessionData', type: 'GET'
  })
  .done(function(msg){
    $.ajax({
      url: 'http://localhost:5000/prontubox/getByIdPaciente', type: 'POST',
      dataType: 'json', data: { id : msg[0].identificador }
    })
    .done(function(msg){
      dados = msg;
      $("#name").attr("placeholder",msg[0].pacienteNome);
      $("#cidade").attr("placeholder",msg[0].pacienteCidade);
      $("#estado").val(msg[0].pacienteEstado);
      $("#email").attr("placeholder",msg[0].pacienteEmail);
    })
    .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

});

function salvar(){
  var name;
  var cidade;
  var estado;
  var emaill;
  var senha;

  $("#aviso").remove();

  if($("#senha").val()!=""){
    if($("#senhaC").val()==""){
      $("#senhaC").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Confirme a nova senha.</div>");
      return;
    }
    if($("#senhaAnt").val()==""){
      $("#senhaAnt").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Insira sua senha antiga.</div>");
      return;
    }
    if($("#senha").val()!=$("#senhaC").val()){
      $("#senhaC").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> As senhas não correspondem.</div>");
      return;
    }
    if($("#senhaAnt").val()!=dados[0].pacienteSenha){
      $("#senhaAnt").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Senha inválida.</div>");
      return;
    }
    senha = $("#senha").val();
  }
  else{ senha = dados[0].pacienteSenha }

  if($("#name").val()!=""){ name = $("#name").val()}
  else { name = dados[0].pacienteNome }
  if($("#cidade").val()!=""){ cidade = $("#cidade").val()}
  else { cidade = dados[0].pacienteCidade }
  estado = $("#estado").val();
  if($("#email").val()!=""){ emaill = $("#email").val()}
  else { emaill = dados[0].pacienteEmail }

  $.ajax({
    url: 'http://localhost:5000/prontubox/updateSessionData', type: 'POST', dataType: 'json',
    data: {
      identificador: dados[0].idpaciente, tipo: "paciente",
      nome: name, email: emaill
    }
  })
  .done(function(msg){
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

  $.ajax({
      url: 'http://localhost:5000/prontubox/updatePaciente',
      type: 'POST',
      dataType: 'json',
      data: {
        idP: dados[0].idpaciente,
        nameP: name,
        cidadeP: cidade,
        estadoP: estado,
        emailP: emaill,
        senhaP: senha
      }
  })
  .done(function(msg){
    $("#botaoOk").attr("disabled", "");
    $("#senhaAnt").after("<div id=\"avisoSucesso\" class=\"alert alert-success\"><strong>Dados alterados com sucesso!</strong><a href=\"../home-medico/index.html\" class=\"alert-link\">  Ok</a>.</div>");
  })
  .fail(function(jqXHR, textStatus, msg){
    console.log(msg);
    alert("Ocorreu um erro interno!");
  });

}
