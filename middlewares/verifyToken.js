const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const { authorization, user_email } = req.headers;
  const token = authorization.split(' ')[1];

  if (!token || !user_email) {
    return res.status(401).send({ message: 'Unauthorized access!' });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Unauthorized access!' });
      } else if (user_email !== decoded.email) {
        return res.status(403).send({ message: 'Forbidden access!' });
      } else {
        next();
      }
    });
  }
};

module.exports = { verifyToken };
