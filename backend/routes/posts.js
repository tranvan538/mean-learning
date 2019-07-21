const express = require('express');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    console.dir(file);
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type: ' + file.mimetype);
    if (isValid) {
      error = null;
    }

    callback(error, 'backend/images');
  },
  filename: (request, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.get('', (request, response, next) => {
  const { query } = request;
  let { pagesize, page: currentPage } = query;
  pagesize = parseInt(pagesize);
  currentPage = parseInt(currentPage);
  let fetchedPosts;

  const postQuery = Post.find();
  if (pagesize && currentPage) {
    postQuery
      .skip(pagesize * (currentPage - 1))
      .limit(pagesize);
  }

  postQuery.find()
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    }).then(count => {
      const posts = fetchedPosts.map(post => {
        const { _id, title, content, imagePath, creator } = post;

        return {
          id: String(_id),
          title,
          content,
          imagePath,
          creator
        }
      });

      response.status(200).json({
        message: 'success',
        posts,
        maxPosts: count
      });
    });
});

router.get('/:id', (request, response, next) => {
  Post.findById(request.params.id).then(postData => {
    if (!postData) {
      return response.status(404).json({message: 'not found'});
    }

    const { _id, title, content, imagePath, creator } = postData;
    const post  = {id: _id, title, content, imagePath, creator};
    response.status(200).json({message: 'Found', post: post});
  });
});

router.post('', checkAuth, multer({storage}).single('image'), (request, response, next) => {
  const url = request.protocol + '://' + request.get('host');
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imagePath: url + '/images/' + request.file.filename,
    creator: request.userData.userId
  });

  post.save().then(createdPost => {
    const {_id, title, content, imagePath} = createdPost;
    response.status(201).json({
      message: 'success',
      post: {
        id: _id,
        title,
        content,
        imagePath
      }
    });
  });

});

router.put('/:id', checkAuth, multer({storage}).single('image'), async (request, response, next) => {
  let imagePath = request.body.imagePath;
  if (request.file) {
    const url = request.protocol + '://' + request.get('host');
    imagePath = url + '/images/' + request.file.filename;
  }

  const post = new Post({
    _id: request.params.id,
    title: request.body.title,
    content: request.body.content,
    imagePath,
    creator: request.userData.userId
  });

  const result = await Post.updateOne({_id: request.params.id, creator: request.userData.userId}, post);
  if (result.n > 0) {
    response.status(200).json({ message: 'success'});
  }

  response.status(401).json({ message: 'Not authorized'});
});


router.delete('/:id', checkAuth, async (request, response, next) => {
  const result = await Post.deleteOne({_id: request.params.id, creator: request.userData.userId });
  if (result.n > 0) {
    response.status(200).json({ message: 'success'});
  }

  response.status(401).json({ message: 'Not authorized'});
});

module.exports = router;
