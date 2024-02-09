// import Stripe from 'stripe'
// const stripe = new Stripe('sk_test_51OgH0MIssiDZvurlanEFlRlWwT1QzJ2Z4wA1HKraBMSHBYgjQ61a4IsK7r97mQFIB1yc2A7DEXynG57vn4TsuZpc00CNBwIbMI')
// import mysql2 from 'mysql2'
// import express from 'express'
// import cors from 'cors'

const stripe = require('stripe')('sk_test_51OgH0MIssiDZvurlanEFlRlWwT1QzJ2Z4wA1HKraBMSHBYgjQ61a4IsK7r97mQFIB1yc2A7DEXynG57vn4TsuZpc00CNBwIbMI');
const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
const path = require('path');

const router = express.Router();


// router.get("/", (req, res) => {
// res.set("Access-Control-Allow-Origin", "'http://localhost:3000'")
// res.set("Access-Control-Allow-Credentials", "true");
// res.setHeader("Access-Control-Max-Age", "1800");
// res.setHeader("Access-Control-Allow-Headers", "content-type");
// res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
//  });

const corsOptions ={
    origin:'http://localhost:3000', 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

// const connection = mysql2.createConnection({
// 	host: "localhost", //if RDS this will change using mysql on ec2 change password
// 	database: "booking",
// 	user: "root",
// 	password: "", //ec2 password Csouth22@ or csouth22@
// })

const connection = mysql2.createConnection({
	host: "database-1.cn9cf1p4mmt6.us-east-2.rds.amazonaws.com", //if RDS this will change using mysql on ec2 change password
	database: "booking_info",
	user: "admin",
	password: "Csouth22!", //ec2 password Csouth22@ or csouth22@
})


const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static("public"));

app.use(express.static(path.join(__dirname,'/')));



// app.get('/', (req, res) =>{
	
	// res.setHeader("Access-Control-Allow-Origin", "'http://localhost:3000'")
	// res.setHeader("Access-Control-Allow-Credentials", "true");
	// res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" );
	

// })

const PORT = 3000;

app.listen(PORT, ()=> {
	console.log(`SERVER : http://localhost:${PORT}`);
	connection.connect((err)=>{
		if(err) throw err;
		console.log("DATABASE CONNECTED");
	})
})

// app.get('/', function(req, res){
// res.send(path.join(__dirname, '/public/index.html'));
// })

app.get("/all/info", (req, res)=>{
    // res.setHeader("Access-Control-Allow-Origin", "'http://localhost:4200'")
	// res.setHeader("Access-Control-Allow-Credentials", "true");
	// res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" );

	const sql_query = `select * from info`
	connection.query(sql_query, (err, result)=>{
		if(err) throw err;
		res.send(result);
	})
})

app.get("/all/info/:id", (req, res)=>{
	var id = req.params.id;
	const sql_query = `select * from info WHERE id = ${id} `
	connection.query(sql_query,  (err, result)=>{
		if(err) throw err;
		res.send(result);
	})
})



app.post('/all/data', function(req, res){
    var username=req.body.name;
    connection.query("INSERT INTO info (name) VALUES (?)", username.toString(), function(err, result){
        if(err) throw err;
            console.log("1 record inserted");
        });
    res.send(username);
})

app.put('/all/update', function(req, res){
    var booking = req.body.booking;
    var id = req.body.id;
    const data = [booking, id]
    connection.query("UPDATE info SET booking = ? WHERE id = ?", data, function(err, result){
        if(err) throw err;
            console.log("1 record updated")
        });
    res.send(data);
})

// app.post('/all/delete', function(req, res){
//     var username=req.body.name;
//     var id = req.body.id;
//     //let id = req.params.id
//     console.log("1 record deleted" + id)
    
//     connection.query(`DELETE FROM info WHERE id = ${id}`, id,function(err, result){
//         if(err) throw err;
//             console.log("1 record deleted" + id)
//         });
//   res.send('record deleted'); 
// })

app.post('/all/checkout', async (req, res) => {
	 const session = await stripe.checkout.sessions.create({
    line_items: [{
	    price_data: {
	      currency: 'usd',
	      unit_amount: 2000,
	      product_data: {
	        name: 'T-shirt',
	        description: 'Comfortable cotton t-shirt',
	      },
	    },
	    quantity: 1,
  }],
    mode: 'payment',
    success_url: `http://localhost:4200/booking`,
    cancel_url: `http://localhost:4200/booking`,
 });

 res.status(200).json(session);
 //res.json({url: session.url})

});

app.post('/all/delete', function(req, res){
    var id = req.body.id;
    
    connection.query(`DELETE FROM info WHERE id = ?`, [id], function(err, result){
        if(err) throw err;
        console.log("1 record deleted" + id);
        res.send('record deleted');
    });
});


