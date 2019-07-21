const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const { email, userId } = jwt.verify(token, 'secret_this_should_be_longer');
    request.userData = { email, userId };

    next();
  } catch (err) {
    response.status(401).json({message: 'Auth failed'});
  }
};
