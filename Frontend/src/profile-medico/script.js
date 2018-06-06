var dados;

$(document).ready(function() {

  $.ajax({
    url: 'http://localhost:5000/prontubox/getSessionData', type: 'GET', dataType: 'json'
  })
  .done(function(msg){
    $.ajax({
      url: 'http://localhost:5000/prontubox/getByIdMedico', type: 'POST',
      dataType: 'json', data: { id : msg[0].identificador }
    })
    .done(function(msg){
      dados = msg;
      $("#name").attr("placeholder",msg[0].medicoNome);
      $("#cidade").attr("placeholder",msg[0].medicoCidade);
      $("#estado").val(msg[0].medicoEstado);
      $("#localTrab").attr("placeholder",msg[0].medicoLocalTrabalho);
      $("#email").attr("placeholder",msg[0].medicoEmail);
    })
    .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

});

function salvar(){
  var nomeM;
  var cidade;
  var estado;
  var local;
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
    if($("#senhaAnt").val()!=dados[0].medicoSenha){
      $("#senhaAnt").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Senha inválida.</div>");
      return;
    }
    senha = $("#senha").val();
  }
  else{ senha = dados[0].medicoSenha }

  if($("#name").val()!=""){ nomeM = $("#name").val()}
  else { nomeM = dados[0].medicoNome }
  if($("#cidade").val()!=""){ cidade = $("#cidade").val()}
  else { cidade = dados[0].medicoCidade }
  estado = $("#estado").val();
  if($("#localTrab").val()!=""){ local = $("#localTrab").val()}
  else { local = dados[0].medicoLocalTrabalho }
  if($("#email").val()!=""){ emaill = $("#email").val()}
  else { emaill = dados[0].medicoEmail }

  $.ajax({
    url: 'http://localhost:5000/prontubox/updateSessionData', type: 'POST', dataType: 'json',
    data: {
      identificador: dados[0].idmedico, tipo: "medico",
      nome: nomeM, email: emaill
    }
  })
  .done(function(msg){
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

  $.ajax({
      url: 'http://localhost:5000/prontubox/updateMedico',
      type: 'POST',
      dataType: 'json',
      data: {
        idM: dados[0].idmedico,
        nameM: nomeM,
        cidadeM: cidade,
        estadoM: estado,
        localTrabM: local,
        emailM: emaill,
        senhaM: senha
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
