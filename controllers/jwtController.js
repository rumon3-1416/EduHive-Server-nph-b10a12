const jwt = require('jsonwebtoken');

// Post Jwt Token
const postJwtToken = async (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '31d',
  });

  res.send({ token });
};

module.exports = { postJwtToken };
