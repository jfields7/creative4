const express = require('express');
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(express.static('../public'));

// connect to the database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wishlist',{
  useNewUrlParser: true
});

const wishlist = require("./wishlist.js");
app.use("/api/wishlist",wishlist);

app.listen(3002, () => console.log('Server listening on port 3002!'));
