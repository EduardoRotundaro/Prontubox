$(document).ready(function() {
});

function procurar(){
  $("#campoderesultado").empty();

  if($("#searchMedico").val()=="" ){
    $("#campoderesultado").html("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Ops!</strong> Insira um CPF no campo acima.</div>");
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
      $("#campoderesultado").html("<div id=\"aviso\" class=\"alert alert-danger\"><strong>Nada encontrado!</strong> Verifique o nome digitado.</div>");
    }
    else{
      var x = 1;
      $.each(msg, function() {
        $("#campoderesultado").append("<div id=\"accordion\"><div class=\"card\"><div id=\"cartao\" class=\"card-header\"><a class=\"card-link\" data-toggle=\"collapse\" href=\"#collapse" + x +"\"><b>Dr. " + this.medicoNome +"</b></a></div><div id=\"collapse" + x + "\" class=\"collapse\" data-parent=\"#accordion\"><div class=\"card-body\"><b>Local de trabalho: </b>" + this.medicoLocalTrabalho + "<br><b>Contato: </b>" + this.medicoEmail + "</div></div></div></div>");
        x = x + 1;
      })

    }
  })
  .fail(function(jqXHR, textStatus, msg){
    console.log(msg);
    alert("Ocorreu um erro interno!");
  });

}
