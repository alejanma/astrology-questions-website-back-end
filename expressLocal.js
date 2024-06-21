const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 8887;
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());


//DB Related stuff
mongoose.set('strictQuery',true);

const itemSchema = new mongoose.Schema({
  CID: String,
  Question: String,
  Answer: String
});

var items;

app.get('/createDBandCollection', (req,res) => {
  const input = req.query;
  console.log(input);

  const DataBase = `mongodb://0.0.0.0:27017/${input.db}`;
  items = mongoose.model(input.cl,itemSchema);
  mongoose.connect(DataBase,{useNewUrlParser: true,useUnifiedTopology: true});
  const db = mongoose.connection;

  db.on('error', err => {console.log(err)});
  db.on('open',()=>{
    console.log("DB successfully read");
  });
  res.send({msg: 'The db was created',dbIsCreated:true});
});

app.post('/addListOfItems', (req,res)=>{
  const input = req.body.params;

  items.insertMany(input).then(
    result => {console.log(`Records added ${result.length}`)},
    err => {console.log(err)})
    .catch(err => console.log(err));

  res.send({msg:'Adding documents'});
});

app.get('/getItemsList',(req,res) => {
  var listOfItems = items.find().then(
    result => {console.log(result); res.send(result)},
    err => {console.log(err)}
  ).catch( err => console.log(err));
  console.log(listOfItems);
});

app.put('/updateItem', (req,res) => {
  input = req.body.params;
  id = input.CID;
  updatedFields = {Question: input.Question,Answer: input.Answer};

  console.log(id);
  console.log(updatedFields);

  items.updateOne({CID:id},{$set: updatedFields},{upsert:true}).then(
    result => console.log(result)
  );

  res.send({msg:'Updating Item'});

});


app.delete('/deleteItem',(req,res) =>{
  const input = req.query;
  console.log(input);
  items.deleteOne(input).then(
    result => {console.log(result)},
    err => {console.log(err)}
  ).catch(err => console.log(err));
  
});

app.delete('/deleteAll',(req,res) =>{
    items.deleteMany({}).then(
      result => {console.log(result)},
      err => {console.log(err)}
    ).catch(err => console.log(err));
});

app.listen(8887, () => console.log(`Server running at localhost: ${port}!`))
