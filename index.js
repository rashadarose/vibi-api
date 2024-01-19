
//const http = require("node:http");
import mysql2 from 'mysql2'
import express from 'express'

const connection = mysql2.createConnection({
	host: "localhost",
	database: "booking",
	user: "root",
	password: "",
})

const app = express();

const PORT = 3000;

app.listen(PORT, ()=> {
	console.log(`SERVER : http://localhost:${PORT}`);
	connection.connect((err)=>{
		if(err) throw err;
		console.log("DATABASE CONNECTED");
	})
})

app.use("/all", (req, res)=>{
	const sql_query = `select * from info`
	connection.query(sql_query, (err, result)=>{
		if(err) throw err;
		res.send(result);
	})
})

// const server = http.createServer((req, res) =>{
// 	res.writeHead(200);
// 	res.end("hello world")
// });

// server.listen(3000, () => {
// 	console.log("server running on port 3000")
// })