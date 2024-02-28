const express = require('express')
const app =express()
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())



// connecting mogodb 

// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tvr8l.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


    const productsCollection=client.db("goFresh").collection("products");
    const ordersCollection=client.db("goFresh").collection("orders");

    app.get('/products',async(req,res)=>{
      const cursor=productsCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })
    app.get('/products/:id',async(req,res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const result= await productsCollection.findOne(query);
      res.send(result)
    })
    // orders 
    app.get('/orders',async(req,res)=>{
      // console.log(req.query.email);
      let query={}
      if(req.query?.email){
        query= {email : req.query.email}
      }
      const result= await ordersCollection.find(query).toArray()
      res.send(result);
    })
    app.post('/orders',async(req,res)=>{
      const order=req.body
      // console.log(order);
      const result= await ordersCollection.insertOne(order);
      res.send(result)
    })
    // delete orders
    app.delete('/orders/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result =await ordersCollection.deleteOne(query);
      res.send(result);
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('hello world')

})

app.listen(port,()=>{
    console.log(`app runing in port number ${port}`);
})