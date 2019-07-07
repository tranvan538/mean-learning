const express = require('express');
const bodyParser = require('body-parser');

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

const Post = require('./models/post');

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.post("/api/posts", (request, response, next) => {
  const post = new Post({
    title: request.body.title,
    content: request.body.content
  });

  post.save().then(createdPost => {
    response.status(201).json({
      message: 'success',
      data: createdPost._id
    });
  });

});

app.get('/api/posts', (request, response, next) => {
  Post.find()
    .then(documents => {
      documents.forEach(post => {
        const id = post._id;
        delete post._id;
        post.id = id;
      });

      response.status(200).json({
        message: 'success',
        data: documents
      });
    });
});

app.delete("/api/posts/:id", (request, response, next) => {
  Post.deleteOne({_id: request.params.id })
    .then(result => {
      response.status(200).json({
        message: 'success'
      });
    })
});

app.listen(3000);
