const express = require('express');
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4jfewjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // data collation
    const jewelleryCollection = client.db('jewelleryDB').collection('jewellery')
    const userCollection = client.db('usersDB').collection('users')
// api route
app.get('/jewellerys',async(req,res)=>{
  const cursor = jewelleryCollection.find();
  const result = await cursor.toArray()
res.send(result)

})

// get specific jewellery
app.get('/jewellerys/:id',async(req,res)=>{
  const id = req.params.id;
  const query={ _id: new ObjectId(id) }       
  const jewellery = await jewelleryCollection.findOne(query);
  res.send(jewellery)
})
// update specific id jewellery
app.put('/updateJewellerys/:id',async(req,res)=>{
  const id = req.params.id;
  const filter={ _id: new ObjectId(id) }  
  const options = {upsert:true} ;
  const updatJewelleru = req.body
  const jewellery = {
    $set:{
      name:updatJewelleru.name,
      brand:updatJewelleru.brand,
      categore:updatJewelleru.categore,
      price:updatJewelleru.price,
      photo:updatJewelleru.photo,
      details:updatJewelleru.details
    }
  }    
  const result = await jewelleryCollection.updateOne(filter,jewellery,options);
  res.send(result)
})

app.get('/updateJewellerys/:id',async(req,res)=>{
  const id = req.params.id;
  const query={ _id: new ObjectId(id) }       
  const jewellery = await jewelleryCollection.findOne(query);
  res.send(jewellery)
})


app.post('/jewellerys',async(req,res)=>{
  const jewellery = req.body;
  const result = await jewelleryCollection.insertOne(jewellery)
  console.log(result)
  res.send(result)
})


// delete a specific jewellery
app.delete('/jewellerys/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await jewelleryCollection.deleteOne(query);
  res.send(result)
})


// users

// create user collection 
app.post('/users',async(req,res)=>{
  const user = req.body;    
  const result= await userCollection.insertOne(user);
  res.send(result)
})







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
    res.send('jewellery server is runing')

})











app.listen(port,()=>{
    console.log(`jewellery server is running on port: ${port} `)
})