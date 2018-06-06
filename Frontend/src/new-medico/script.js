var quantity;

$(document).ready(function() {

  $.ajax({ url: 'http://localhost:5000/prontubox/countMedico', type: 'get' })
  .done(function(msg){ quantity = msg[0].quant + 1; })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

});

function novaConta(){

  if($("#medicoNome").val()=="" || $("#medicoCpf").val()=="" ||
      $("#medicoRegistro").val()=="" || $("#medicoCidade").val()=="" ||
      $("#medicoLocalTrabalho").val()=="" || $("#medicoDataNascimento").val()=="" ||
      $("#medicoEmail").val()=="" || $("#medicoSenha").val()=="" ||
      $("#medicoSenhaC").val()=="" ){

    if($("#medicoNome").val()=="") { $("#medicoNome").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu nome.</div>"); }
    if($("#medicoCpf").val()=="") { $("#medicoCpf").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu CPF.</div>"); }
    if($("#medicoRegistro").val()=="") {$("#medicoRegistro").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira o registro (licença).</div>"); }
    if($("#medicoCidade").val()=="") { $("#medicoCidade").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira sua cidade natal.</div>"); }
    if($("#medicoLocalTrabalho").val()=="") { $("#medicoLocalTrabalho").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira o local de trabalho (cidade).</div>"); }
    if($("#medicoDataNascimento").val()=="") { $("#medicoDataNascimento").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Selecione sua data de nascimento.</div>"); }
    if($("#medicoEmail").val()=="") { $("#medicoEmail").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira um e-mail.</div>"); }
    if($("#medicoSenha").val()=="") { $("#medicoSenha").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira uma senha.</div>"); }
    if($("#medicoSenhaC").val()=="") { $("#medicoSenhaC").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Confirme sua senha.</div>"); }

    return;
  }

  $(".alert").remove();

  if($("#medicoSenha").val() != $("#medicoSenhaC").val() ){
    $("#medicoSenhaC").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> As senhas não correspondem.</div>");
    return;
  }

  $(".alert").remove();

  var dados = {
    nome: $("#medicoNome").val(),
    cpf: $("#medicoCpf").val(),
    registro: $("#medicoRegistro").val(),
    cidade: $("#medicoCidade").val(),
    estado: $("#medicoEstado").val(),
    localTrabalho: $("#medicoLocalTrabalho").val(),
    dataNascimento: $("#medicoDataNascimento").val(),
    email: $("#medicoEmail").val(),
    senha: $("#medicoSenha").val()
  }

  $.ajax({
      url: 'http://localhost:5000/prontubox/verificaEmail', type: 'POST',
      dataType: 'json', data: { email: dados.email }
  })
  .done(function(msg){
    if(msg.length!=0){
      $("#medicoEmail").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Esqueceu a senha?</strong> E-mail já cadastrado.</div>");
    }
    else{
      $(".alert").remove();
      $.ajax({
        url: 'http://localhost:5000/prontubox/newMedico',
        type: 'POST',
        dataType: 'json',
        data: {
          idmedico: quantity,
          medicoNome: dados.nome,
          medicoCpf: dados.cpf,
          medicoRegistro: dados.registro,
          medicoCidade: dados.cidade,
          medicoEstado: dados.estado,
          medicoLocalTrabalho: dados.localTrabalho,
          medicoDataNascimento: dados.dataNascimento,
          medicoIdade: 100,
          medicoEmail: dados.email,
          medicoSenha: dados.senha,
          medicoTelefone: "none"
        }
      })
      .done(function(msg){
        $("#confirmarBtn").remove();
        $("#medicoSenhaC").after("<div class=\"alert alert-success w-25 mx-auto mt-3\"><strong>Conta criada com sucesso!</strong> Voltar para a <a href=\"../home/index.html\" class=\"alert-link\">página inicial</a>.</div>");
      })
      .fail(function(jqXHR, textStatus, msg){
        console.log(msg);
        alert("Ocorreu um erro interno!");
      });
    }
  })
  .fail(function(jqXHR, textStatus, msg){ alert("Ocorreu um erro interno!"); return; });

}
