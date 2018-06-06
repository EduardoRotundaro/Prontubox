//Carregamento de módulos
var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

//Configuração do banco de dados
var dbConfig = {
        host    : 'localhost',
        user    : 'root',
        password: 'root',
        port    : '3304',
        database: 'prontubox'
};

//Teste de conexão com o BD
var test = mysql.createConnection(dbConfig);
test.connect(function(err){
  if(err){
    console.log('e: [DataBase] Not connected');
    return console.log(err);
  }
  console.log('i: [DataBase] Connected');
})
test.end();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Definição da porta da aplicação
var port = process.env.PORT || 5000;

var prontuBox = express.Router();

// ---------------- Rotas ----------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/newMedico', function(req, res) {
  var idMedico = req.body.idmedico;
  var name = req.body.medicoNome;
  var cpf = req.body.medicoCpf;
	var reg = req.body.medicoRegistro;
	var cidade = req.body.medicoCidade;
	var estado = req.body.medicoEstado;
	var localTrab = req.body.medicoLocalTrabalho;
	var dataNasc = req.body.medicoDataNascimento;
	var idade = req.body.medicoIdade;
	var email = req.body.medicoEmail;
	var senha = req.body.medicoSenha;
	var telefone = req.body.medicoTelefone;
	var strQuery = "INSERT INTO medico (idmedico, medicoNome, medicoCpf, medicoRegistro, medicoCidade, medicoEstado, medicoLocalTrabalho, medicoDataNascimento, medicoIdade, 	medicoEmail, medicoSenha, medicoTelefone" +
	") VALUES ('" + idMedico + "','" + name + "','" + cpf + "','" + reg + "','" + cidade + "', '" + estado + "', '" + localTrab + "', '" + dataNasc + "', '" + idade + "', '" + email + "', '" + senha + "', '" + telefone + "');";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
	connection.query(strQuery, function(err, rows, fields) {
		if (!err) {
			console.log('i: [QUERY] Insert successful - Table medico');
			res.jsonp(rows);
        }
		else{
			console.log('i: [QUERY] Insert failed - Table medico');
			res.jsonp(err);
		}
	});
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/newPaciente', function(req, res) {
  var pacienteId = req.body.idpaciente;
	var name = req.body.pacienteNome;
	var cpf = req.body.pacienteCpf;
	var dataNasc = req.body.pacienteDataNascimento;
	var idade = req.body.pacienteIdade;
	var cidade = req.body.pacienteCidade;
	var estado = req.body.pacienteEstado;
	var email = req.body.pacienteEmail;
	var senha = req.body.pacienteSenha;
	var strQuery = "INSERT INTO paciente (idpaciente, pacienteNome, pacienteCpf, pacienteDataNascimento, pacienteIdade, pacienteCidade, pacienteEstado, pacienteEmail, pacienteSenha" +
	") VALUES ('" + pacienteId + "', '" + name + "', '" + cpf + "', '" + dataNasc + "', '" + idade + "', '" + cidade + "', '" + estado + "', '" + email + "', '" + senha + "');";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
	connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
			console.log('i: [QUERY] Insert successful - Table paciente');
			res.jsonp(rows);
    }
		else {
			console.log('i: [QUERY] Insert failed - Table paciente');
			res.jsonp(err);
    }
	});
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/newProntuario', function(req, res) {
	var medicoId = req.body.medico;
	var pacienteId = req.body.paciente;
	var data = req.body.data;
	var idreg = req.body.prontuarioId;
	var diag = req.body.diag;
	var strQuery = "INSERT INTO prontuario (medico_idmedico, paciente_idpaciente, prontuarioData, prontuarioId, prontuarioDiagnostico"+
	") VALUES ('" + medicoId + "', '" + pacienteId + "', '" + data + "', '" + idreg + "', '" + diag + "');";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
	connection.query(strQuery, function(err, rows, fields) {
		if (!err) {
			console.log('i: [QUERY] Insert successful - Table prontuario');
			res.jsonp(rows);
		}
		else {
			console.log('i: [QUERY] Insert failed - Table prontuario');
			res.jsonp(err);
		}
	});
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/updateMedico', function(req, res) {
	var id = req.body.idM;
	var name = req.body.nameM;
	var cidade = req.body.cidadeM;
	var estado = req.body.estadoM;
	var localTrab = req.body.localTrabM;
	var email = req.body.emailM;
	var senha = req.body.senhaM;
	var strQuery = "UPDATE medico SET medicoNome = '" + name + "', medicoCidade = '" + cidade + "', medicoEstado = '" + estado +
	"', medicoLocalTrabalho = '" + localTrab + "', medicoEmail = '" + email + "', medicoSenha = '" + senha + "' WHERE idmedico = '" + id + "';";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
	connection.query(strQuery, function(err, rows, fields) {
		if (!err) {
			console.log('i: [QUERY] Update successful - Table medico');
			res.jsonp(rows);
		}
		else {
			console.log('i: [QUERY] Update failed - Table medico');
			res.jsonp(err);
		}
	});
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

prontuBox.post('/updatePaciente', function(req, res) {
  var id  = req.body.idP;
	var name = req.body.nameP;
	var cidade = req.body.cidadeP;
	var estado = req.body.estadoP;
	var email = req.body.emailP;
	var senha = req.body.senhaP;
  var strQuery = "UPDATE paciente SET pacienteNome = '" + name + "', pacienteCidade = '" + cidade + "', pacienteEstado = '" + estado
	+ "', pacienteEmail = '" + email + "', pacienteSenha = '" + senha + "' WHERE idpaciente = '" + id + "';";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
			console.log('i: [QUERY] Update successful - Table paciente');
			res.jsonp(rows);
    }
		else {
			console.log('i: [QUERY] Update failed - Table paciente');
			res.jsonp(err);
    }
  });
  connection.end();
});

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/getByIdMedico', function(req, res) {
  var id = req.body.id;
  var strQuery = "SELECT * FROM medico WHERE idmedico = '" + id + "'";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select by id successful - Table medico');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Select by id failed - Table medico');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/loginMedico', function(req, res) {
  var email = req.body.email;
  var senha = req.body.senha;
  var strQuery = "SELECT * FROM medico WHERE medicoEmail = '" + email + "' AND medicoSenha = '" + senha + "'";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Login successful - Table medico');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Login failed - Table medico');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/verificaEmail', function(req, res) {
  var email = req.body.email;
  var strQuery = "SELECT * FROM medico WHERE medicoEmail = '" + email + "'";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      res.jsonp(rows);
      console.log('i: [QUERY] Email (check) successful - Table medico');
    }
    else {
      console.log('i: [QUERY] Email (check) failed - Table medico');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/verificaEmailP', function(req, res) {
  var email = req.body.email;
  var strQuery = "SELECT * FROM paciente WHERE pacienteEmail = '" + email + "'";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      res.jsonp(rows);
      console.log('i: [QUERY] Email (check) successful - Table paciente');
    }
    else {
      console.log('i: [QUERY] Email (check) failed - Table paciente');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/getByIdPaciente', function(req, res) {
  var id = req.body.id;
  var strQuery = "SELECT * FROM paciente WHERE idpaciente = '" + id+ "';";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select successful - Table paciente');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Select failed - Table paciente');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/listProntuarioM', function(req, res) {
  var id = req.body.id;
  var strQuery = "SELECT * FROM prontuario INNER JOIN paciente ON prontuario.paciente_idpaciente = paciente.idpaciente WHERE prontuario.medico_idmedico = '" + id +"'; ";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select successful - Table paciente');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Select failed - Table paciente');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/listProntuarioP', function(req, res) {
  var id = req.body.id;
  var strQuery = "SELECT * FROM prontuario INNER JOIN medico ON prontuario.medico_idmedico = medico.idmedico WHERE prontuario.paciente_idpaciente = '" + id + "'; ";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select successful - Table paciente');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Select failed - Table paciente');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/loginPaciente', function(req, res) {
  var email = req.body.email;
  var senha = req.body.senha;
  var strQuery = "SELECT * FROM paciente WHERE pacienteEmail = '" + email + "' AND pacienteSenha = '" + senha + "'";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Login successful - Table paciente');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Login failed - Table paciente');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/getByIdPProntuario', function(req, res) {
  var id = req.body.id;
  var strQuery = "SELECT * FROM prontuario WHERE paciente_idpaciente = '" + id + "'";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select successful - Table prontuario');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Select by id failed - Table prontuario');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/getByIdMProntuario', function(req, res) {
  var id = req.body.id;
  var strQuery = "SELECT * FROM prontuario WHERE medico_idmedico = '" + id + "'";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select successful - Table prontuario');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Select by id failed - Table prontuario');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

prontuBox.post('/removeProntuario', function(req, res) {
  var id = req.body.id;

  var strQuery = "DELETE FROM prontuario WHERE prontuarioId = " + id;

  var connection = mysql.createConnection(dbConfig);
  connection.connect();

  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [CRUD] Delete failed - Table prontuario');
      res.jsonp(rows);
    }
    else {
      console.log('i: [CRUD] Delete successful - Table prontuario');
      res.jsonp(err);
    }
  });

  connection.end();
});

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.get('/countMedico', function(req, res) {
  var strQuery = "SELECT count(idmedico) AS quant FROM medico";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select count successful - Table medico');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Select count failed - Table medico');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.get('/countPaciente', function(req, res) {
  var strQuery = "SELECT count(idpaciente) AS quant FROM paciente";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select count successful - Table paciente');
      res.jsonp(rows);
    }

    else {
      console.log('i: [QUERY] Select count failed - Table paciente');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.get('/countProntuario', function(req, res) {
  var strQuery = "SELECT count(prontuarioId) AS quant FROM prontuario";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select count successful - Table prontuario');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Select count failed - Table prontuario');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/prontuariosPaciente', function(req, res) {
  var  id = req.body.id;
  var strQuery = "SELECT * FROM prontuario WHERE paciente_idpaciente = '" + id +  "'";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Lista prontuarios successful - Table paciente');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Lista prontuarios failed - Table paciente');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/searchPaciente', function(req, res) {
  var cpf = req.body.cpf;
  var strQuery = "SELECT * FROM paciente WHERE pacienteCpf = '" + cpf +  "'";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Search successful - Table paciente');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Search failed - Table paciente');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/searchMedico', function(req, res) {
  var name = req.body.nome;
  var strQuery = "SELECT * FROM medico WHERE medicoNome LIKE '%" + name +  "%';";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Search successful - Table medico');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Search failed - Table medico');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.get('/getSessionData', function(req, res) {
  var strQuery = "SELECT * FROM sessao";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      console.log('i: [QUERY] Select (*) successful - Table sessao');
      res.jsonp(rows);
    }
    else {
      console.log('i: [QUERY] Select (*) failed - Table sessao');
      res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------
prontuBox.post('/updateSessionData', function(req, res) {
  var tipo = req.body.tipo;
  var id = req.body.identificador;
	var name = req.body.nome;
	var email = req.body.email;
	var strQuery = "UPDATE sessao SET tipo = '" + tipo + "', identificador = " + id + ", nome = '" + name
  + "', email = '" + email + "' WHERE idsessao = 1;";
  var connection = mysql.createConnection(dbConfig);

  connection.connect();
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
			console.log('i: [QUERY] Update successful - Table sessao');
			res.jsonp(rows);
    }
		else {
			console.log('i: [QUERY] Update failed - Table sessao');
			res.jsonp(err);
    }
  });
  connection.end();
});
//-------------------------------------------------------------------------------------------------------------------------------------

app.use('/prontubox', prontuBox);

app.listen(port);
console.log('i: [APP] Starting application on port ' + port);
