const { tryCatch } = require('../utils/tryCatch');

const postTransaction = tryCatch(async (req, res, collection) => {
  const { email, id } = req.body;
  const transactionsDoc = { email, classId: id, date: Date.now() };

  const result = await collection.insertOne(transactionsDoc);

  res.send(result);
});

module.exports = { postTransaction };
