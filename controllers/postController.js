const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// Add User
const postUser = tryCatch(async (req, res) => {
  const { email, displayName } = req.body;

  const usersCollection = await connectDB('users');
  const result = await usersCollection.findOne({ email });

  if (!result) {
    await usersCollection.insertOne({
      email,
      displayName,
      role: 'student',
    });

    return res.send({ role: 'student' });
  }

  res.send({ role: result.role });
});

// Save Transaction
const postTransaction = tryCatch(async (req, res) => {
  const { transactionDetails } = req.body;
  const transactionsDoc = { ...transactionDetails, date: Date.now() };

  const transactionCollection = await connectDB('transactions');
  const result = await transactionCollection.insertOne(transactionsDoc);

  res.send(result);
});

// Save Teacher Request
const postTeacherReq = tryCatch(async (req, res) => {
  const teacherDetails = req.body;

  const teacherDoc = {
    ...teacherDetails,
    status: 'pending',
  };

  const teacherReqCollection = await connectDB('teacher_requests');
  const result = await teacherReqCollection.insertOne(teacherDoc);

  res.send(result);
});

module.exports = { postTransaction, postUser, postTeacherReq };
