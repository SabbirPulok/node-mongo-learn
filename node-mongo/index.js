const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
    
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        //{price:{$lt:500000}}
        collection.find().limit(parseInt(limit)).toArray((err,documents)=>{
            if(err)
            {
                res.status(500).send({message:err})
            }
            else
            {
                //console.log("Successfully Inserted ");
                res.send(documents);
            }
        });
        //console.log("database connected....");
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

app.get('/products/:key',(req,res)=>{
    const key = req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true });
    
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key}).toArray((err,documents)=>{
            if(err)
            {
                res.status(500).send({message:err})
            }
            else
            {
                console.log("Successfully Inserted ");
                res.send(documents[0]);
            }
        });
        //console.log("database connected....");
        client.close();
    });
})

app.post('/getCartProduct',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true });
     const productKeys = req.body;
     console.log(productKeys);
     client.connect(err => {
         const collection = client.db("onlineStore").collection("products");
         collection.find({key :{$in:productKeys}}).toArray((err,documents)=>{
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
         //console.log("database connected....");
         client.close();
     });
 })

 app.post('/placeOrder',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true });
     const orderDetails = req.body;
     orderDetails.placedAt = new Date();
     //console.log(orderDetails);
     client.connect(err => {
         const collection = client.db("onlineStore").collection("orders");
         collection.insertOne(orderDetails,(err,result)=>{
             if(err)
             {
                res.status(500).send({message:err})
             }
             else
             {
                res.send(result.ops[0])
             }
         });
         //console.log("database connected....");
         client.close();
     });
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
                //console.log("Successfully Inserted ");
                res.send(result.ops[0])
            }
        });
        //console.log("database connected....");
        client.close();
    });
})
app.post('/addAllProducts',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true });
     const product = req.body;
     client.connect(err => {
         const collection = client.db("onlineStore").collection("products");
         collection.insert(product,(err,result)=>{
             if(err)
             {
                 res.status(500).send({message:err})
             }
             else
             {
                 //console.log("Successfully Inserted ");
                 res.send(result.ops[0])
             }
         });
         //console.log("database connected....");
         client.close();
     });
 })
app.post('/saveProduct/:id',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    const productId =req.params.id;
    const product = req.body;
    //console.log(productId);
    //console.log(product);
    client.connect(error=>{
        const collection = client.db("onlineStore").collection("products");
        collection.findOneAndUpdate(
            {'_id': new ObjectID(productId)},
            {"$set":{"name":product.name,"price":product.price,"stock":product.stock}},
            (err,result)=>{
                if(result.val)
                {
                    res.send({updated:true})
                }
                else
                {
                    res.status(500).send({updated:false})
                }
            })
    })
    //console.log("database connected....");
    client.close();
})
app.get('/editProduct/:id',(req,res)=>{
    const productId = req.params.id;
    //console.log(productId);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(error=>{
        const collection = client.db("onlineStore").collection("products");
        collection.findOne({'_id':new ObjectID(productId)},(err,documents)=>{
            if(err)
            {
                res.status(500).send({message:err})
            }
            else
            {
                res.send(documents);
            }
        })
    })
    //console.log("database connected....");
    client.close();
})
app.get('/deleteProduct/:id',(req,res)=>{
    const productId = req.params.id;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(error=>{       
        const collection = client.db("onlineStore").collection("products");
        collection.findOneAndDelete({'_id': new ObjectID(productId)},(err,result)=>{
            //console.log(result);
            if(result.value){
                res.send({acknowledge:true})
            }
            else
            {
                res.status(500).send({acknowledge:false})                
            }
        });
    });
    //console.log("database connected....");
    client.close();
})
const port =process.env.PORT || 3000;
app.listen(port,()=>console.log("Listening to port ",port));