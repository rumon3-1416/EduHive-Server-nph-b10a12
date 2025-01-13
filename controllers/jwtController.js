const jwt = require('jsonwebtoken');

const cookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
};

// Post Jwt Token
const postJwtToken = async (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '31d',
  });

  res.cookie('token', token, cookieOption).send({ success: true });
};

// Clear Jwt Token
const clearJwtToken = async (req, res) => {
  res
    .clearCookie('token', { ...cookieOption, maxAge: 0 })
    .send({ success: true });
};

module.exports = { postJwtToken, clearJwtToken };
