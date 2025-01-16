const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');
const { connectDB } = require('../config/database');

// Banner Slides
const getSlides = tryCatch(async (req, res) => {
  const slidesCollection = await connectDB('banner_slides');

  const result = await slidesCollection.find().toArray();
  res.send(result);
});

// Classes
const getClasses = tryCatch(async (req, res) => {
  const { popular, limit } = req.query;

  const filter = {
    status: 'approved',
  };
  const sortQuery = popular ? { total_enrolment: -1 } : {};
  const limitQuery = limit ? parseInt(limit) : 0;

  const classCollection = await connectDB('classes');
  const result = await classCollection
    .find(filter)
    .sort(sortQuery)
    .limit(limitQuery)
    .toArray();

  res.send(result);
});

// Feedbacks
const getFeedBacks = tryCatch(async (req, res) => {
  const feedbackCollection = await connectDB('feedbacks');
  const result = await feedbackCollection.find().toArray();

  res.send(result);
});

// Overview
const getOverview = tryCatch(async (req, res) => {
  const aggregation = [
    {
      $group: {
        _id: null,
        totalEnrolment: { $sum: '$total_enrolment' },
      },
    },
  ];

  const classCollection = await connectDB('classes');
  const userCollection = await connectDB('users');

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
const getClassDetails = tryCatch(async (req, res) => {
  const { id } = req.params;

  const filter = { _id: new ObjectId(id) };

  const classCollection = await connectDB('classes');
  const result = await classCollection.findOne(filter);

  res.send(result);
});

// Teacher Requests
const getTeachReqCount = tryCatch(async (req, res) => {
  const teacherReqCollection = await connectDB('teacher_requests');
  const result = await teacherReqCollection.countDocuments();
  res.send({ count: result });
});

// Teacher Requests
const getTeacherRequests = tryCatch(async (req, res) => {
  const { page, data } = req.query;

  const skip = page ? parseInt(page) - 1 : 0;
  const limit = data ? parseInt(data) : 0;

  const teacherReqCollection = await connectDB('teacher_requests');
  const result = await teacherReqCollection
    .find()
    .skip(skip)
    .limit(limit)
    .toArray();
  res.send(result);
});

module.exports = {
  getSlides,
  getClasses,
  getFeedBacks,
  getOverview,
  getClassDetails,
  getTeachReqCount,
  getTeacherRequests,
};
