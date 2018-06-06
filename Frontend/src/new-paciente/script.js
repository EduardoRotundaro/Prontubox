var quantity;

$(document).ready(function() {

  $.ajax({ url: 'http://localhost:5000/prontubox/countPaciente', type: 'get' })
  .done(function(msg){ quantity = msg[0].quant + 1; })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

});

function novaConta(){

  $(".alert").remove();
  if($("#pacienteNome").val()=="" || $("#pacienteCpf").val()=="" ||
      $("#pacienteCidade").val()=="" || $("#pacienteDataNascimento").val()=="" ||
      $("#pacienteEmail").val()=="" || $("#pacienteSenha").val()=="" ||
      $("#pacienteSenhaC").val()=="" ){

    if($("#pacienteNome").val()=="") { $("#pacienteNome").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu nome.</div>"); }
    if($("#pacienteCpf").val()=="") { $("#pacienteCpf").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu CPF.</div>"); }
    if($("#pacienteCidade").val()=="") { $("#pacienteCidade").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira sua cidade.</div>"); }
    if($("#pacienteDataNascimento").val()=="") { $("#pacienteDataNascimento").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Selecione sua data de nascimento.</div>"); }
    if($("#pacienteEmail").val()=="") { $("#pacienteEmail").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu e-mail.</div>"); }
    if($("#pacienteSenha").val()=="") { $("#pacienteSenha").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira uma senha.</div>"); }
    if($("#pacienteSenhaC").val()=="") { $("#pacienteSenhaC").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Confirme sua senha.</div>"); }

    return;
  }

  $(".alert").remove();

  if($("#pacienteSenha").val() != $("#pacienteSenhaC").val() ){
    $("#pacienteSenhaC").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> As senhas não são iguais.</div>");
    return;
  }
  $(".alert").remove();

  var dados = {
    nome: $("#pacienteNome").val(),
    cpf: $("#pacienteCpf").val(),
    cidade: $("#pacienteCidade").val(),
    estado: $("#pacienteEstado").val(),
    dataNascimento: $("#pacienteDataNascimento").val(),
    email: $("#pacienteEmail").val(),
    senha: $("#pacienteSenha").val()
  }

  $.ajax({
      url: 'http://localhost:5000/prontubox/verificaEmailP', type: 'POST',
      dataType: 'json', data: { email: dados.email }
  })
  .done(function(msg){
    if(msg.length!=0){
      $("#pacienteEmail").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Esqueceu a senha?</strong> E-mail já cadastrado.</div>");
    }
    else{
      $(".alert").remove();
      $.ajax({
        url: 'http://localhost:5000/prontubox/newPaciente',
        type: 'POST',
        dataType: 'json',
        data: {
          idpaciente: quantity,
          pacienteNome: dados.nome,
          pacienteCpf: dados.cpf,
          pacienteCidade: dados.cidade,
          pacienteEstado: dados.estado,
          pacienteDataNascimento: dados.dataNascimento,
          pacienteIdade: 100,
          pacienteEmail: dados.email,
          pacienteSenha: dados.senha,
          medicoTelefone: "none"
        }
      })
      .done(function(msg){
        $("#confirmarBtn").remove();
        $("#pacienteSenhaC").after("<div class=\"alert alert-success w-25 mx-auto mt-3\"><strong>Conta criada com sucesso!</strong> Voltar para a <a href=\"../home/index.html\" class=\"alert-link\">página inicial</a>.</div>");
      })
      .fail(function(jqXHR, textStatus, msg){
        console.log(msg);
        alert("Ocorreu um erro interno!");
      });
    }
  })
  .fail(function(jqXHR, textStatus, msg){ alert("Ocorreu um erro interno!"); return; });

}
