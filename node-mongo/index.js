const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const user = ["Jahid","Rakib","Sohan","Gatsby","Barfi"];

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/',(req,res)=>{
    const fruit = {
        product: "onion",
        price :220
    }
    res.send(fruit);
});

app.get('/products',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    const limit = req.query.limit;
    const priceGT =100;

    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");

        collection.find({price:{$lt:"500000"}}).limit(parseInt(limit)).toArray((err,documents)=>{
            if(err)
            {
                res.status(500).send({message:err})
            }
            else
            {
                console.log("Successfully Inserted ");
                res.send(documents);
            }
        });
        console.log("database connected....");
        client.close();
    });
})
app.get('/fruits/banana',(req,res)=>{
    res.send({
        product:"banana",
        quantity:12,
        price:40
    })
})

app.get('/users/:id',(req,res)=>{
    const id = req.params.id;
    const sortQuery = req.query.sort;
    console.log(sortQuery);
    const name = user[id];
    res.send({id,name});
})

app.post('/addProduct',(req,res)=>{
   client = new MongoClient(uri, { useNewUrlParser: true });
    const product = req.body;
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product,(err,result)=>{
            if(err)
            {
                res.status(500).send({message:err})
            }
            else
            {
                console.log("Successfully Inserted ");
                res.send(result.ops[0])
            }
        });
        console.log("database connected....");
        client.close();
    });
})
const port =process.env.PORT || 3000;
app.listen(port,()=>console.log("Listening to port ",port));