const path=require('path');
const multer = require('multer')
const ejs=require('ejs');
const mongoose = require('mongoose');
const express= require('express');
const app = express();


// init middleware 
app.use(express.json({ extended: false }))

// connect mongodb database
mongoose.connect('mongodb://127.0.0.1:27017/cartoonydb', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", function() {
console.log("MongoDB database connection established successfully");
  });

// ejs engine
app.set('views', './views');
app.set('view engine', 'ejs');


// calling route 
app.use('/', require('./routes/api/approutes'))

// server initiate
app.listen(5000, () => console.log(`Server is stated on http://localhost:5000`));