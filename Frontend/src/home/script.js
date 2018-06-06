$(document).ready(function() {
  efeito();
  $("#notMedico").mouseenter(function(){
    $("#notMedico").css("font-size", "16px");
  });
  $("#notMedico").mouseleave(function(){
    $("#notMedico").css("font-size", "15px");

  });

});

function login(){

  if($("#email").val()=="" || $("#senha").val()=="" ){
    if($("#email").val()=="") { $("#email").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira o e-mail.</div>"); }
    if($("#senha").val()=="") { $("#senha").after("<div class=\"w-25 mx-auto alert alert-danger\"><strong>Ops!</strong> Insira a senha.</div>");  }
    return;
  }

  $(".alert").remove();

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
          $("#loginArea").after("<div class=\"w-50 mx-auto alert alert-danger\"><strong>Eita!</strong> Não foi possivel fazer o login. Verifique o e-mail e/ou a senha.</div>");
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
            window.location.href = "../home-paciente/index.html";
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
        window.location.href = "../home-medico/index.html";
      })
      .fail(function(jqXHR, textStatus, msg){ console.log(msg); alert("Ocorreu um erro interno!"); });
    }
  })
  .fail(function(jqXHR, textStatus, msg){
    console.log(msg);
    alert("Ocorreu um erro interno!");
  });

}

function efeito(){
  $("#email").hide().delay("1000").fadeIn("slow");
  $("#senha").hide().delay("1500").fadeIn("slow");
  $("#novoPacienteLink").hide();
  $("#notMedico").click(function(){
    $("#novoPacienteLink").fadeIn("slow");
  });

}
