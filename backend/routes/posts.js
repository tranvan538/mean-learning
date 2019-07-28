const express = require('express');
const router = express.Router();

const PostHandler = require('../controllers/posts');
const postHandler = new PostHandler();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

router.get('', postHandler.get);
router.get('/:id', postHandler.getById);
router.post('', checkAuth, extractFile, postHandler.createPost);
router.put('/:id', checkAuth, extractFile, postHandler.updatePost);
router.delete('/:id', checkAuth, postHandler.deletePost);

module.exports = router;
