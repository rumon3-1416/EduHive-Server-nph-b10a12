const { tryCatch } = require('../utils/tryCatch');

const getUsers = tryCatch(async (req, res, collection) => {
  const result = await collection.find().toArray();
  res.send(result);
});

module.exports = { getUsers };
