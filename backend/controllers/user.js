const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

class UserHandler {
  async createuser(request, response, next) {
    const {email, password} = request.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({email, password: hash});
    try {
      const result = await user.save();
      response.status(201).json({message: 'Success', result})
    } catch (err) {
      console.error(err);
      response.status(500).json({
        message: 'Invalid authentication credentials!'
      });
    }
  }

  async login(request, response, next) {
    const {email, password} = request.body;
    const user = await User.findOne({email});
    if (!user) {
      return response.status(401).json({
        message: 'User not found'
      });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return response.status(401).json({
        message: 'Wrong password'
      })
    }

    const userId = user._id;
    const token = jwt.sign(
      {email, userId: userId},
      'secret_this_should_be_longer',
      {expiresIn: '1h'}
    );

    response.status(200).json({
      token,
      expiresIn: 3600,
      userId
    });
  }
}

module.exports = UserHandler;
