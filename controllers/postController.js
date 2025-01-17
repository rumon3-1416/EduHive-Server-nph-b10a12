const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// Add User
const postUser = tryCatch(async (req, res) => {
  const { email, displayName, photoURL } = req.body;

  const usersCollection = await connectDB('users');
  const result = await usersCollection.findOne({ email });

  if (!result) {
    await usersCollection.insertOne({
      email,
      displayName,
      photoURL,
      role: 'student',
    });

    res.send({ role: 'student' });
  } else {
    await usersCollection.updateOne(
      { email },
      { $set: { displayName, photoURL } },
      { upsert: true }
    );

    res.send({ role: result.role });
  }
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

// Add Class
const postClass = tryCatch(async (req, res) => {
  const classDetails = req.body;
  const classDoc = {
    ...classDetails,
    price: parseInt(classDetails.price),
    status: 'pending',
    total_enrolment: 0,
  };

  const classCollection = await connectDB('classes');
  const result = await classCollection.insertOne(classDoc);

  res.send(result);
});

module.exports = { postTransaction, postUser, postTeacherReq, postClass };
