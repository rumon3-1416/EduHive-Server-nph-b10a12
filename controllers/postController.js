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
  }

  res.send({ success: true });
});

// Save Transaction
const postTransaction = tryCatch(async (req, res, collection) => {
  const { transactionDetails } = req.body;
  const transactionsDoc = { ...transactionDetails, date: Date.now() };

  const result = await collection.insertOne(transactionsDoc);

  res.send(result);
});

module.exports = { postTransaction, postUser };
