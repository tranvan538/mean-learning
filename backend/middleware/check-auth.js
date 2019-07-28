const jwt = require('jsonwebtoken');

const { JWT_KEY } = process.env;

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const { email, userId } = jwt.verify(token, JWT_KEY);
    request.userData = { email, userId };

    next();
  } catch (err) {
    response.status(401).json({message: 'You are not authenticated!'});
  }
};
