const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('doctors'));
app.use(fileUpload());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h7tlf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointment");
  const doctorsCollection = client.db("doctorsPortal").collection("addDoctors");

  app.post('/addAppointment', (req, res) => {
    const appointments = req.body;
    console.log(appointments)
    appointmentCollection.insertOne(appointments)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/appointments', (req, res) => {
    appointmentCollection.find({})
    .toArray((err, result) => {
      res.send(result)
    })
  })

  app.post('/appointmentsByDate', (req, res) => {
    const date = req.body;
    console.log(date.date);
    appointmentCollection.find({date: date.date})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addDoctors', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    console.log(file, name, email);
    doctorsCollection.insertOne( {file, name, email})
    .then(doctors =>{
      res.send(doctors.insertedCount > 0)
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || 5050)