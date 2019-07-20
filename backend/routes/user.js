const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

router.post('/signup', async (request, response, next) => {
  const { email, password } = request.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({email, password: hash});
  try {
    const result = await user.save();
    response.status(201).json({message: 'Success', result })
  } catch (err) {
    console.error(err);
    response.status(500).json({err});
  }
});

module.exports = router;
