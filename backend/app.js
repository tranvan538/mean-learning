const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const postRouter = require('./routes/posts');
const userRouter = require('./routes/user');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dinh:cV9nldLkCLej1mbk@cluster0-pi84c.gcp.mongodb.net/mean-course?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database');
  }).catch((error) => {
    console.log('Connected to database error: ' + error);
  });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postRouter);
app.use('/api/user', userRouter);


app.listen(3000);
