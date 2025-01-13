const { tryCatch } = require('../utils/tryCatch');

const getSlides = tryCatch(async (req, res, collection) => {
  const result = await collection.find().toArray();
  res.send(result);
});

module.exports = { getSlides };
