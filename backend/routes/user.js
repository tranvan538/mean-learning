const express = require('express');
const router = express.Router();

const UserHandler = require('../controllers/user');
const userHandler = new UserHandler();

router.post('/signup', userHandler.createuser);
router.post('/login', userHandler.login);

module.exports = router;
