const { tryCatch } = require('../utils/tryCatch');

// Add User
const postUser = tryCatch(async (req, res, collection) => {
  const { email, displayName } = req.body;

  const result = await collection.findOne({ email });
  if (!result) {
    await collection.insertOne({
      email,
      displayName,
      role: 'student',
    });

    return res.send({ role: 'student' });
  }

  res.send({ role: result.role });
});

// Save Transaction
const postTransaction = tryCatch(async (req, res, collection) => {
  const { transactionDetails } = req.body;
  const transactionsDoc = { ...transactionDetails, date: Date.now() };

  const result = await collection.insertOne(transactionsDoc);

  res.send(result);
});

// Save Teacher Request
const postTeacherReq = tryCatch(async (req, res, collection) => {
  const teacherDetails = req.body;

  const teacherDoc = {
    ...teacherDetails,
    status: 'pending',
  };

  const result = await collection.insertOne(teacherDoc);

  res.send(result);
});

module.exports = { postTransaction, postUser, postTeacherReq };
