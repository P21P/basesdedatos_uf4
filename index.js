#!/usr/bin/node

const http = require("http");
const node_static = require("node-static");

const mongo = require("mongodb").MongoClient;

let server_url = "mongodb://localhost:27017";

let chat_db

mongo.connect(server_url, (error, server) => {
  if (error){
	  console.log("Error en la conexión a MongoDB");
	  throw error;
  }
	            
  console.log("Dentro de MongoDB");
	
  chat_db = server.db("amongmeme");

});

console.log("Inicializando servidor chat");

let public_files = new node_static.Server("pub");

http.createServer( (request, response) => {
	
	if (request.url.startaWith == "/chat"){
		//console.log("Entrando en el chat");
	let info = request.url.split("=");
		console.log(info[1]);
	let query = {
		date = { $gt : parseInt(info[1])}	
	};
	let cursor = chat_db.collection("chat").find({query});

		cursor.toArray().then( (data) => {
			//console.log(data);

			response.writeHead(200, {'Content-Type':'text/plain'});

			response.write (JSON,stringfy(data) );
			response.end();
		});

		return;
	}
	
	if (request.url == "/recent"){

		let cursor = chat_db.collection("chat").find({},{limit:5, sort:{$natural:-1}});
			cursor.toArray().then( (data) => {
				response.writeHead(200, {'Content-Type':'text/plain'});
				response.write (JSON,stringfy(data) );
				response.emd();
			});
		return;
	}
	

	
	if (request.url == "/submit"){
		console.log("Envio de datos");
		
		let body = [];
		request.on('data', chunk => {
			body.push(chunk);
		}).on('end', () => {
			let chat_data = JSON.parse(Buffer.concat(body).toString());
			
			chat_db.collection("chat").insertOne({
				user:chat_data.user.chat_user,
				msg:chat_data.chat_msg,
				date: Date.now()
			});
		});

		response.end();
		
		return;
	}


	
	public_files.serve(request, response);
	

}).listen(8080);

