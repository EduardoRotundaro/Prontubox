function login(){

  $(".alert").remove();

  if($("#email").val()=="" || $("#senha").val()=="" ){
    if($("#email").val()=="") { $("#email").after("<div class=\"mx-auto alert alert-danger\"><strong>Ops!</strong> Insira o e-mail.</div>"); }
    if($("#senha").val()=="") { $("#senha").after("<div class=\"mx-auto alert alert-danger\"><strong>Ops!</strong> Insira a senha.</div>");  }
    return;
  }

  if($("#email").css("color")=="rgb(255, 0, 0)"){
    $("#email").after("<div class=\"mx-auto alert alert-danger\"><strong>Ops!</strong> Este e-mail não é valido.</div>");
    return;
  }

  var credentials = {
    email : $("#email").val(),
    senha : $("#senha").val()
  }

  $.ajax({
      url: 'http://localhost:5000/prontubox/loginMedico',
      type: 'POST',
      dataType: 'json',
      data: {
        email: credentials.email,
        senha: credentials.senha
      }
  })
  .done(function(msg){
    console.log(msg);
    if(msg.length==0){
      $.ajax({
          url: 'http://localhost:5000/prontubox/loginPaciente',
          type: 'POST',
          dataType: 'json',
          data: {
            email: credentials.email,
            senha: credentials.senha
          }
      })
      .done(function(msg){
        console.log(msg);
        if(msg.length==0){
          $("#loginArea").after("<div class=\"mx-auto alert alert-danger\"><strong>Eita!</strong> Não foi possivel fazer o login. Verifique o e-mail e/ou a senha.</div>");
        }
        else{

          //sessao
          $.ajax({
            url: 'http://localhost:5000/prontubox/updateSessionData', type: 'POST', dataType: 'json',
            data: {
              identificador: msg[0].idpaciente, tipo: "paciente",
              nome: msg[0].pacienteNome, email: msg[0].pacienteEmail
            }
          })
          .done(function(msg){
            window.location.href = "home-patient.html";
          })
          .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

        }
      })
      .fail(function(jqXHR, textStatus, msg){
        console.log(msg);
        alert("Ocorreu um erro interno!");
      });

    }
    else{

      //sessao
      $.ajax({
        url: 'http://localhost:5000/prontubox/updateSessionData', type: 'POST', dataType: 'json',
        data: {
          identificador: msg[0].idmedico, tipo: "medico",
          nome: msg[0].medicoNome, email: msg[0].medicoEmail
        }
      })
      .done(function(msg){
        window.location.href = "home-doctor.html";
      })
      .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
    }
  })
  .fail(function(jqXHR, textStatus, msg){
    console.log(msg);
    alert("Ocorreu um erro interno!");
  });

}

function searchDoctor(){
  $("#campoderesultado").empty();

  if($("#searchMedico").val()=="" ){
    $("#campoderesultado").html("<div id=\"srchWarning\" class=\"alert alert-danger\"><strong>Ops!</strong> Insira um nome no campo acima.</div>");
    return;
  }

  if($("#searchMedico").css("color")=="rgb(255, 0, 0)") {
    $("#campoderesultado").html("<div id=\"srchWarning\" class=\"alert alert-danger\"><strong>Ops!</strong> Este nome não é válido.</div>");
    return;
  }

  var field = $("#searchMedico").val();
  $.ajax({
      url: 'http://localhost:5000/prontubox/searchMedico',
      type: 'POST',
      dataType: 'json',
      data: {
        nome: field
      }
  })
  .done(function(msg){
    if(msg.length==0){
      $("#campoderesultado").html("<div id=\"srchDocWarning\" class=\"alert alert-danger\"><strong>Nada encontrado!</strong> Verifique o nome digitado.</div>");
    }
    else{
      var x = 1;
      $.each(msg, function() {
        $("#campoderesultado").append("<div id=\"accordionDoc\"><div class=\"card\"><div id=\"cartao\" class=\"card-header\"><a class=\"card-link\" data-toggle=\"collapse\" href=\"#collapse" + x +"\"><b>Dr. " + this.medicoNome +"</b></a></div><div id=\"collapse" + x + "\" class=\"collapse\" data-parent=\"#accordionDoc\"><div class=\"card-body\"><b>Local de trabalho: </b>" + this.medicoLocalTrabalho + "<br><b>Contato: </b>" + this.medicoEmail + "</div></div></div></div>");
        x = x + 1;
      })

    }
  })
  .fail(function(jqXHR, textStatus, msg){
    console.log(msg);
    alert("Ocorreu um erro interno!");
  });

}

var paciente;
var prontuarios;

function searchPatient(){

  $("#campoderesultado").empty();
  if($("#searchPaciente").val()=="" ){
    $("#campoderesultado").html("<div id=\"srchWarning\" class=\"alert alert-danger\"><strong>Ops!</strong> Insira um CPF no campo acima.</div>");
    return;
  }

  if($("#searchPaciente").css("color")=="rgb(255, 0, 0)") {
    $("#campoderesultado").html("<div id=\"srchWarning\" class=\"alert alert-danger\"><strong>Ops!</strong> Insira um CPF válido no campo acima.</div>");
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
      $("#campoderesultado").html("<div id=\"srchWarning\" class=\"alert alert-danger\"><strong>Verifique o CPF digitado!</strong> Não foi encontrado nada.</div>");
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

function deleteMR(id){
  $("#confirmDeleteWarn").html("<h6><b>Tem certeza que deseja excluir? A exclusão é permanente.</b></h6>");
  $("#confirmDeleteWarn").css("color", "rgb(220,53,69)");
  $("#confirmDeleteWarn").fadeIn("slow");
  $("#confirmDeleteWarn").attr("tabindex",-1).focus();
  $("#confirmDeleteButtons").fadeIn("slow");
  $("#yesButton").attr("onclick","removeProntuario("+ id +")");
}

function removeProntuario(idMR){

  $.ajax({
      url: 'http://localhost:5000/prontubox/removeProntuario',
      type: 'POST',
      dataType: 'json',
      data: { id: idMR }
  })
  .done(function(msg){
    $.ajax({
      url: 'http://localhost:5000/prontubox/newProntuario',
      type: 'POST',
      dataType: 'json',
      data: {
        medico: 0, paciente: 0,
      	data: "nulo", prontuarioId: idMR, diag:"nulo"
      }
    })
    .done(function(jqXHR, textStatus, msg){ location.reload(); })
    .fail(function(jqXHR, textStatus, msg){ console.log(msg); });
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

}

function clearWarning(){
  $("#confirmDeleteWarn").hide();
  $("#confirmDeleteButtons").hide();
}

function registerDoctor(){

  $(".alert").remove();

  if($("#medicoNome").val()=="" || $("#medicoCpf").val()=="" ||
      $("#medicoRegistro").val()=="" || $("#medicoCidade").val()=="" ||
      $("#medicoLocalTrabalho").val()=="" || $("#medicoDataNascimento").val()=="" ||
      $("#medicoEmail").val()=="" || $("#medicoSenha").val()=="" ||
      $("#medicoSenhaC").val()=="" ){

    if($("#medicoNome").val()=="") { $("#medicoNome").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu nome.</div>"); }
    if($("#medicoCpf").val()=="") { $("#medicoCpf").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu CPF.</div>"); }
    if($("#medicoRegistro").val()=="") {$("#medicoRegistro").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira o registro (licença).</div>"); }
    if($("#medicoCidade").val()=="") { $("#medicoCidade").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira sua cidade natal.</div>"); }
    if($("#medicoLocalTrabalho").val()=="") { $("#medicoLocalTrabalho").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira o local de trabalho (cidade).</div>"); }
    if($("#medicoDataNascimento").val()=="") { $("#medicoDataNascimento").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Selecione sua data de nascimento.</div>"); }
    if($("#medicoEmail").val()=="") { $("#medicoEmail").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira um e-mail.</div>"); }
    if($("#medicoSenha").val()=="") { $("#medicoSenha").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira uma senha.</div>"); }
    if($("#medicoSenhaC").val()=="") { $("#medicoSenhaC").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Confirme sua senha.</div>"); }

    return;
  }

  if($("#medicoNome").css("color")=="rgb(255, 0, 0)") {
    $("#medicoNome").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Este não é um nome válido.</div>");
    return;
  }
  if($("#medicoCpf").css("color")=="rgb(255, 0, 0)") {
    $("#medicoCpf").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Este CPF não é válido.</div>");
    return;
  }
  if($("#medicoRegistro").css("color")=="rgb(255, 0, 0)") {
    $("#medicoRegistro").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Este registro (licença) não é valido.</div>");
    return;
  }
  if($("#medicoCidade").css("color")=="rgb(255, 0, 0)") {
    $("#medicoCidade").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Nome inválido.</div>");
    return;
  }
  if($("#medicoLocalTrabalho").css("color")=="rgb(255, 0, 0)") {
    $("#medicoLocalTrabalho").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Nome inválido.</div>");
    return;
  }
  if($("#medicoEmail").css("color")=="rgb(255, 0, 0)") {
    $("#medicoEmail").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Este e-mail não é valido.</div>");
    return;
  }
  if($("#medicoSenha").css("color")=="rgb(255, 0, 0)") {
    $("#medicoSenha").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> A senha deve conter pelo menos 8 caracteres, sendo pelo menos 1 número, 1 letra e 1 caracter especial.</div>");
    return;
  }

  if($("#medicoSenha").val() != $("#medicoSenhaC").val() ){
    $("#medicoSenhaC").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> As senhas não correspondem.</div>");
    return;
  }

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
      $("#medicoEmail").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Esqueceu a senha?</strong> E-mail já cadastrado.</div>");
    }
    else{
      var quantity;
      $(".alert").remove();

      $.ajax({ url: 'http://localhost:5000/prontubox/countMedico', type: 'get' })
      .done(function(msg){
        quantity = msg[0].quant + 1;

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
          $("#medicoSenhaC").after("<div class=\"alert alert-success w-50 mx-auto mt-3\" id=\"sucesso\"><strong>Conta criada com sucesso!</strong> Voltar para a <a href=\"login.html\" class=\"alert-link\">página inicial</a>.</div>");
          $("#sucesso").attr("tabindex",-1).focus();
        })
        .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
      })
      .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
    }
  })
  .fail(function(jqXHR, textStatus, msg){ alert("Ocorreu um erro interno!"); return; });

}

function registerPatient(){

  $(".alert").remove();
  if($("#pacienteNome").val()=="" || $("#pacienteCpf").val()=="" ||
      $("#pacienteCidade").val()=="" || $("#pacienteDataNascimento").val()=="" ||
      $("#pacienteEmail").val()=="" || $("#pacienteSenha").val()=="" ||
      $("#pacienteSenhaC").val()=="" ){

    if($("#pacienteNome").val()=="") { $("#pacienteNome").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu nome.</div>"); }
    if($("#pacienteCpf").val()=="") { $("#pacienteCpf").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu CPF.</div>"); }
    if($("#pacienteCidade").val()=="") { $("#pacienteCidade").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira sua cidade.</div>"); }
    if($("#pacienteDataNascimento").val()=="") { $("#pacienteDataNascimento").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Selecione sua data de nascimento.</div>"); }
    if($("#pacienteEmail").val()=="") { $("#pacienteEmail").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira seu e-mail.</div>"); }
    if($("#pacienteSenha").val()=="") { $("#pacienteSenha").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira uma senha.</div>"); }
    if($("#pacienteSenhaC").val()=="") { $("#pacienteSenhaC").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Confirme sua senha.</div>"); }

    return;
  }

  if($("#pacienteNome").css("color")=="rgb(255, 0, 0)") {
    $("#pacienteNome").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Este não é um nome válido.</div>");
    return;
  }
  if($("#pacienteCpf").css("color")=="rgb(255, 0, 0)") {
    $("#pacienteCpf").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Este CPF não é válido.</div>");
    return;
  }
  if($("#pacienteCidade").css("color")=="rgb(255, 0, 0)") {
    $("#pacienteCidade").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Nome inválido.</div>");
    return;
  }
  if($("#pacienteEmail").css("color")=="rgb(255, 0, 0)") {
    $("#pacienteEmail").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Este e-mail não é valido.</div>");
    return;
  }
  if($("#pacienteSenha").css("color")=="rgb(255, 0, 0)") {
    $("#pacienteSenha").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> A senha deve conter pelo menos 8 caracteres, sendo pelo menos 1 número, 1 letra e 1 caracter especial.</div>");
    return;
  }

  if($("#pacienteSenha").val() != $("#pacienteSenhaC").val() ){
    $("#pacienteSenhaC").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> As senhas não são iguais.</div>");
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
      $("#pacienteEmail").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Esqueceu a senha?</strong> E-mail já cadastrado.</div>");
    }
    else{
      var quantity;
      $(".alert").remove();

      $.ajax({ url: 'http://localhost:5000/prontubox/countPaciente', type: 'get' })
      .done(function(msg){
        quantity = msg[0].quant + 1;

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
          $("#pacienteSenhaC").after("<div class=\"alert alert-success w-50 mx-auto mt-3\" id=\"sucesso\"><strong>Conta criada com sucesso!</strong> Voltar para a <a href=\"login.html\" class=\"alert-link\">página inicial</a>.</div>");
          $("#sucesso").attr("tabindex",-1).focus();
        })
        .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
      })
      .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
    }
  })
  .fail(function(jqXHR, textStatus, msg){ alert("Ocorreu um erro interno!"); return; });

}


var pacienteId;
var medicoId;
var numProntuario;

function procurar(){

  $(".alert").remove();

  $("#newMROkButton").attr("disabled", "");

  if($("#pacienteCpf").val()=="" ){
    $("#pacienteResultado").html("<div id=\"newMRWarning\" class=\"alert alert-danger\"><strong>Ops!</strong> Insira um CPF no campo acima.</div>");
    return;
  }
  if($("#pacienteCpf").css("color")=="rgb(255, 0, 0)") {
    $("#pacienteResultado").html("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Ops!</strong> Este CPF não é válido.</div>");
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
      $("#pacienteResultado").html("<div id=\"newMRWarning\" class=\"alert alert-danger\"><strong>Nenhum resultado!</strong> Verifique o CPF digitado.</div>");
    }
    else{
      $("#newMROkButton").removeAttr("disabled");

      $("#pacienteResultado").html("<div id=\"accordionNewMR\"><div class=\"card\"><div id=\"cartao\" class=\"card-header\"><a class=\"card-link\" data-toggle=\"collapse\" href=\"#collapseOne\"><b>" + msg[0].pacienteNome +"</b></a></div><div id=\"collapseOne\" class=\"collapse\" data-parent=\"#accordionNewMR\"><div class=\"card-body\"><b>Data de nascimento: </b>" + msg[0].pacienteDataNascimento + "<br><b>Origem: </b>" + msg[0].pacienteCidade + ' - ' +  msg[0].pacienteEstado + "</div></div></div></div>");

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
    if($("#prontuarioData").val()=="") { $("#dataField").after("<div id=\"newMRWarning\" class=\"alert alert-danger\"><strong>Ops!</strong> Selecione a data.</div>"); }
    if($("#prontuarioDiagnostico").val()=="") { $("#prontuarioDiagnostico").after("<div id=\"newMRWarning\" class=\"alert alert-danger\"><strong>Ops!</strong> Esse campo não pode ficar em branco.</div>"); }
    return;
  }

  $("#newMRWarning").remove();

  $.ajax({
    url: 'http://localhost:5000/prontubox/getSessionData', type: 'GET'
  })
  .done(function(msg){
    medicoId = msg[0].identificador;

    $.ajax({
      url: 'http://localhost:5000/prontubox/countProntuario', type: 'GET'
    })
    .done(function(msg){
      numProntuario = msg[0].quant;

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
        $("#newMROkButton").attr("disabled", "");
        $("#newMRSearchButton").attr("disabled", "");
        $("#newMRCancelButton").html("Voltar");
        $("#newMRButtons").after("<div id=\"newMRWarning\" class=\"alert alert-success\"><strong>Prontuário cadastrado com sucesso! </strong><a href=\"home-doctor.html\" class=\"alert-link\">Ok</a>.</div>");
        $("#sucesso").attr("tabindex",-1).focus();
      })
      .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

    })
    .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
}

function saveChangesDoctor(){
  var nomeM;
  var cidade;
  var estado;
  var local;
  var emaill;
  var senha;
  var dados;

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

  $("#aviso").remove();

  if($("#name").val()=="" && $("#cidade").val()=="" && $("#localTrab").val()=="" && $("#email").val()=="" && $("#senha").val()==""){
    return;
  }

  if($("#name").val()!="" && $("#name").css("color")=="rgb(255, 0, 0)"){
    $("#name").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Este nome não é válido.</div>");
    return;
  }
  if($("#cidade").val()!="" && $("#cidade").css("color")=="rgb(255, 0, 0)"){
    $("#cidade").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Nome inválido.</div>");
    return;
  }
  if($("#localTrab").val()!="" && $("#localTrab").css("color")=="rgb(255, 0, 0)"){
    $("#localTrab").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Nome inválido.</div>");
    return;
  }
  if($("#email").val()!="" && $("#email").css("color")=="rgb(255, 0, 0)"){
    $("#email").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Este e-mail não é valido.</div>");
    return;
  }
  if($("#senha").val()!="" && $("#senha").css("color")=="rgb(255, 0, 0)"){
    $("#senha").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> A senha deve conter pelo menos 8 caracteres, sendo pelo menos 1 número, 1 letra e 1 caracter especial.</div>");
    return;
  }

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
    $("#profileOKButton").attr("disabled", "");
    $("#senhaAnt").after("<div id=\"avisoSucesso\" class=\"alert alert-success\"><strong>Dados alterados com sucesso!</strong><a href=\"home-doctor.html\" class=\"alert-link\">  Ok</a>.</div>");
  })
  .fail(function(jqXHR, textStatus, msg){
    console.log(msg);
    alert("Ocorreu um erro interno!");
  });

    })
    .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

}

function saveChangesPatient(){
  var name;
  var cidade;
  var estado;
  var emaill;
  var senha;
  var dados;

  $("#aviso").remove();

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

  if($("#name").val()=="" && $("#cidade").val()=="" && $("#email").val()=="" && $("#senha").val()==""){
    return;
  }

  if($("#name").val()!="" && $("#name").css("color")=="rgb(255, 0, 0)"){
    $("#name").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Este nome não é válido.</div>");
    return;
  }
  if($("#cidade").val()!="" && $("#cidade").css("color")=="rgb(255, 0, 0)"){
    $("#cidade").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Nome inválido.</div>");
    return;
  }
  if($("#email").val()!="" && $("#email").css("color")=="rgb(255, 0, 0)"){
    $("#email").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Este e-mail não é valido.</div>");
    return;
  }
  if($("#senha").val()!="" && $("#senha").css("color")=="rgb(255, 0, 0)"){
    $("#senha").after("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> A senha deve conter pelo menos 8 caracteres, sendo pelo menos 1 número, 1 letra e 1 caracter especial.</div>");
    return;
  }

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
    $("#profileOKButton").attr("disabled", "");
    $("#senhaAnt").after("<div id=\"avisoSucesso\" class=\"alert alert-success\"><strong>Dados alterados com sucesso!</strong><a href=\"home-patient.html\" class=\"alert-link\">  Ok</a>.</div>");
  })
  .fail(function(jqXHR, textStatus, msg){
    console.log(msg);
    alert("Ocorreu um erro interno!");
  });

    })
    .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
  })
  .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });

}
