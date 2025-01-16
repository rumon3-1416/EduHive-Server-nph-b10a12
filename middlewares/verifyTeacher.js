const { connectDB } = require('../config/database');

const verifyTeacher = async (req, res, next) => {
  const userCollection = await connectDB('users');
  const result = await userCollection.findOne({ email: user_email });
  console.log(result);

  next();
};

module.exports = { verifyTeacher };
