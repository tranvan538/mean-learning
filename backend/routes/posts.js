const express = require('express');
const router = express.Router();

const Post = require('../models/post');

router.get('', (request, response, next) => {
  Post.find()
    .then(documents => {
      const posts = documents.map(post => {
        return {
          id: String(post._id),
          title: post.title,
          content: post.content
        }
      });

      response.status(200).json({
        message: 'success',
        data: posts
      });
    });
});

router.get('/:id', (request, response, next) => {
  Post.findById(request.params.id).then(postData => {
    if (postData) {
      const { id, title, content } = postData;
      const post  = {id, title, content};
      response.status(200).json({message: 'Found', data: post});
    } else {
      response.status(404).json({message: 'not found'});
    }
  });
});

router.post('', (request, response, next) => {
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

router.put('/:id', (request, response, edit) => {
  console.dir(request);

  const post = new Post({
    _id: request.params.id,
    title: request.body.title,
    content: request.body.content
  });

  Post.updateOne({_id: request.params.id}, post)
    .then(result => {
      console.log(result);
      response.status(200).json({ message: 'success'});
    })
});


router.delete('/:id', (request, response, next) => {
  Post.deleteOne({_id: request.params.id })
    .then(result => {
      response.status(200).json({
        message: 'success'
      });
    })
});

module.exports = router;
