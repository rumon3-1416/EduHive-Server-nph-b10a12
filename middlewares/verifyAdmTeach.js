const { connectDB } = require('../config/database');

const verifyAdmTeach = async (req, res, next) => {
  const { user_email } = req.headers;

  const userCollection = await connectDB('users');
  const result = await userCollection.findOne({ email: user_email });

  if (result?.role === 'admin' || result?.role === 'teacher') {
    next();
  } else {
    return res.status(401).send({ message: 'Unauthorized access!' });
  }
};

module.exports = { verifyAdmTeach };
