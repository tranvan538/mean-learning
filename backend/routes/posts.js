const express = require('express');
const router = express.Router();

const PostHandler = require('../controllers/posts');
const postHandler = new PostHandler();

const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};


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

router.get('', postHandler.get);
router.get('/:id', postHandler.getById);
router.post('', checkAuth, multer({storage}).single('image'), postHandler.createPost);
router.put('/:id', checkAuth, multer({storage}).single('image'), postHandler.updatePost);
router.delete('/:id', checkAuth, postHandler.deletePost);

module.exports = router;
