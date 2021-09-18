var pg = require("pg"); // requisita a biblioteca pg para a comunicacao com o banco de dados.
 var express = require('express'); // requisita a biblioteca para a criacao dos serviços web.
 
 var app = express(); // iniciliaza uma variavel chamada app que possitilitará a criação dos serviços e rotas.

 app.use(express.json());//padrao de mensagens em json.
 
 app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    next();
});

const config = {
    host: 'localhost',
    user: 'postgres',
    database: 'db_cs_programacao3',
    password: 'palermo12',
    port: 5432
};

//definia conexao com o banco de dados.
const postgres = new pg.Pool(config);

//req: dados da requisicao do serviço web.
//res: dados que serão devolvidos para o requistante.
app.get('/', (req, res) => {
    res.send('Hello, world! meu primeiro teste.');
})
 
//inicia um servico na porta 4000 da maquina onde esteja rodando.
app.listen(4002, function () {
    console.log('Server is running.. on Port 4002');
});

//definindo um serviço web, que estará acessível pelo endereço http://localhost:4002/listarmas
app.get('/listarmas', function (req, res) {

    postgres.connect(function(err,client,done) {

       if(err){

           console.log("Não conseguiu acessar o BD :"+ err);
           res.status(400).send('{'+err+'}');
       }else{
        
        client.query('SELECT * from tb_arma',function(err,result) {        
                
                done(); // closing the connection;
                if(err){

                    console.log(err);

                    res.status(400).send('{'+err+'}');

                }else{

                    res.status(200).send(result.rows);//retorna para o requisitante a lista de registro(s) encontrado(s) pelo comando select.
                }
                
            });
       } 
    });
});

app.get('/deletearma/:nome', (req, res) => {

    postgres.connect(function(err,client,done) {
        if(err){
            console.log("Não conseguiu acessar o serviço deletearma!"+ err);
            res.status(400).send('{'+err+'}');
        }else{

            var q ={
                text: 'delete FROM tb_arma where nome = $1',
                values: [req.params.nome]
            }

            client.query( q , function(err,result) {
                done(); // closing the connection;
                if(err){
                    console.log(err);
                    res.status(400).send('{'+err+'}');
                }else{
                    res.status(200).send(req.params.nome);//retorna o nickname deletado.
                }

            });
        } 
     });

});

app.get('/listmunicao', function (req, res) {

    postgres.connect(function(err,client,done) {

       if(err){

           console.log("Não conseguiu acessar o BD :"+ err);
           res.status(400).send('{'+err+'}');
       }else{
        
        client.query('SELECT * from tb_municao',function(err,result) {        
                
                done(); // closing the connection;
                if(err){

                    console.log(err);

                    res.status(400).send('{'+err+'}');

                }else{

                    res.status(200).send(result.rows);//retorna para o requisitante a lista de registro(s) encontrado(s) pelo comando select.
                }
                
            });
       } 
    });
});