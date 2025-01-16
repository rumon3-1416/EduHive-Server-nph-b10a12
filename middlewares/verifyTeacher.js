const { connectDB } = require('../config/database');

const verifyTeacher = async (req, res, next) => {
  const { user_email } = req.headers;

  const userCollection = await connectDB('users');
  const result = await userCollection.findOne({ email: user_email });

  if (result.role !== 'teacher') {
    return res.status(401).send({ message: 'Unauthorized access!' });
  } else {
    next();
  }
};

module.exports = { verifyTeacher };
