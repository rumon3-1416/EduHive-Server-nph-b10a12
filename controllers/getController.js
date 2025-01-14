const { tryCatch } = require('../utils/tryCatch');

// Banner Slides
const getSlides = tryCatch(async (req, res, collection) => {
  const result = await collection.find().toArray();
  res.send(result);
});

// Popular Classes
const getClasses = async (req, res, collection) => {
  const { popular, limit } = req.query;

  const filter = {
    status: 'approved',
  };
  const sortQuery = popular ? { total_enrolment: -1 } : {};
  const limitQuery = limit ? parseInt(limit) : 0;

  const result = await collection
    .find(filter)
    .sort(sortQuery)
    .limit(limitQuery)
    .toArray();

  res.send(result);
};

module.exports = { getSlides, getClasses };
