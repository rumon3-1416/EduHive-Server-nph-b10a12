const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');

// Banner Slides
const getSlides = tryCatch(async (req, res, collection) => {
  const result = await collection.find().toArray();
  res.send(result);
});

// Popular Classes
const getClasses = tryCatch(async (req, res, collection) => {
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
});

// Feedbacks
const getFeedBacks = tryCatch(async (req, res, collection) => {
  const result = await collection.find().toArray();

  res.send(result);
});

// Overview
const getOverview = tryCatch(async (req, res, collections) => {
  const { classCollection, userCollection } = collections;

  const aggregation = [
    {
      $group: {
        _id: null,
        totalEnrolment: { $sum: '$total_enrolment' },
      },
    },
  ];

  const totalClass = await classCollection.countDocuments({
    status: 'approved',
  });
  const totalUsers = await userCollection.countDocuments();
  const totalEnrolled = await classCollection.aggregate(aggregation).toArray();

  res.send({
    totalClass,
    totalUsers,
    totalEnrolled: totalEnrolled[0].totalEnrolment,
  });
});

// Class Details
const getClassDetails = tryCatch(async (req, res, collection) => {
  const { id } = req.params;

  const filter = { _id: new ObjectId(id) };

  const result = await collection.findOne(filter);

  res.send(result);
});

module.exports = {
  getSlides,
  getClasses,
  getFeedBacks,
  getOverview,
  getClassDetails,
};
