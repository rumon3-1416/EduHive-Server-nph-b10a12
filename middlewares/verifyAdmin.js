const { connectDB } = require('../config/database');

const verifyAdmin = async (req, res, next) => {
  const { user_email } = req.headers;

  const userCollection = await connectDB('users');
  const result = await userCollection.findOne({ email: user_email });
  console.log(result);

  next();
};

module.exports = { verifyAdmin };
