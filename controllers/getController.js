const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');
const { connectDB } = require('../config/database');

// Banner Slides
const getSlides = tryCatch(async (req, res) => {
  const slidesCollection = await connectDB('banner_slides');

  const result = await slidesCollection.find().toArray();
  res.send(result);
});

// Partners
const getPartners = tryCatch(async (req, res) => {
  const partnerCollection = await connectDB('partners');
  const result = await partnerCollection.find().toArray();

  res.send(result);
});

// Categories
const getCategories = tryCatch(async (req, res) => {
  const categoriesCollection = await connectDB('categories');
  const result = await categoriesCollection.find().toArray();
  res.send(result);
});

// Classes
const getClasses = tryCatch(async (req, res) => {
  const { popular, sort, limit, page } = req.query;

  const filter = {
    status: 'approved',
  };
  const limitQuery = limit ? parseInt(limit) : 0;
  const sortQuery = popular
    ? { total_enrolment: -1 }
    : sort === 'low-high'
    ? { price: 1 }
    : sort === 'high-low'
    ? { price: -1 }
    : {};
  const skip = page ? (parseInt(page) - 1) * limit : 0;

  const classCollection = await connectDB('classes');
  const count = await classCollection.countDocuments(filter);
  const result = await classCollection
    .find(filter)
    .sort(sortQuery)
    .skip(skip)
    .limit(limitQuery)
    .toArray();

  res.send({ classes: result, count });
});

// All Classes
const getAllClasses = tryCatch(async (req, res) => {
  const { page, data } = req.query;

  const limit = data ? parseInt(data) : 0;
  const skip = page && data ? (parseInt(page) - 1) * limit : 0;

  const classCollection = await connectDB('classes');
  const count = await classCollection.countDocuments();
  const classes = await classCollection
    .find()
    .skip(skip)
    .limit(limit)
    .toArray();
  res.send({ classes, count });
});

// Class Details
const getClassDetails = tryCatch(async (req, res) => {
  const { id } = req.params;

  const filter = { _id: new ObjectId(id) };

  const classCollection = await connectDB('classes');
  const result = await classCollection.findOne(filter);

  res.send(result);
});

// Student Classes
const getStudentEnrolls = tryCatch(async (req, res) => {
  const { user_email } = req.headers;

  const transactionCollection = await connectDB('transactions');

  const result = await transactionCollection
    .aggregate([
      {
        $match: { email: user_email },
      },
      {
        $addFields: {
          classIdObj: { $toObjectId: '$classId' },
        },
      },
      {
        $lookup: {
          from: 'classes',
          localField: 'classIdObj',
          foreignField: '_id',
          as: 'enrolls',
        },
      },
      {
        $unwind: '$enrolls',
      },
      {
        $replaceRoot: {
          newRoot: '$enrolls',
        },
      },
    ])
    .toArray();

  res.send(result);
});

// Class Progress
const getClassProgress = tryCatch(async (req, res) => {
  const { id } = req.params;

  const assignmentCollection = await connectDB('assignments');
  const classCollection = await connectDB('classes');

  const { total_enrolment, submitted } = await classCollection.findOne({
    _id: new ObjectId(id),
  });

  const assignmentDetails = await assignmentCollection
    .find({ classId: id })
    .toArray();

  const progress = {
    total_enrolment,
    total_assignment: assignmentDetails.length,
    total_submission: submitted || 0,
  };

  res.send(progress);
});

// Class Assignment
const getClassAssignments = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { page, data } = req.query;

  const limit = data ? parseInt(data) : 0;
  const skip = page && data ? (parseInt(page) - 1) * limit : 0;

  const assignmentCollection = await connectDB('assignments');
  const count = await assignmentCollection.countDocuments({ classId: id });
  const assignments = await assignmentCollection
    .find({ classId: id })
    .skip(skip)
    .limit(limit)
    .toArray();

  res.send({ assignments, count });
});

// Teacher own Classes
const getTeacherClasses = tryCatch(async (req, res) => {
  const { user_email } = req.headers;
  const { page, data } = req.query;

  const limit = data ? parseInt(data) : 0;
  const skip = page && data ? (parseInt(page) - 1) * limit : 0;

  const classCollection = await connectDB('classes');
  const count = await classCollection.countDocuments({ email: user_email });
  const teacherClasses = await classCollection
    .find({ email: user_email })
    .skip(skip)
    .limit(limit)
    .toArray();

  res.send({ teacherClasses, count });
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

// Teacher Requests
const getTeacherRequests = tryCatch(async (req, res) => {
  const { page, data } = req.query;

  const limit = data ? parseInt(data) : 0;
  const skip = page && data ? (parseInt(page) - 1) * limit : 0;

  const teacherReqCollection = await connectDB('teacher_requests');
  const count = await teacherReqCollection.countDocuments();
  const requests = await teacherReqCollection
    .find()
    .skip(skip)
    .limit(limit)
    .toArray();
  res.send({ requests, count });
});

// Get Users
const getUsers = tryCatch(async (req, res) => {
  const { page, data, search } = req.query;

  const filter = { email: { $regex: search, $options: 'i' } };
  const limit = data ? parseInt(data) : 0;
  const skip = page && data ? (parseInt(page) - 1) * limit : 0;

  const usersCollection = await connectDB('users');
  const count = await usersCollection.countDocuments();
  const users = await usersCollection
    .find(filter)
    .skip(skip)
    .limit(limit)
    .toArray();
  res.send({ users, count });
});

// Get Profile Info
const getProfileInfo = tryCatch(async (req, res) => {
  const { user_email } = req.headers;

  const usersCollection = await connectDB('users');
  const result = await usersCollection.findOne({ email: user_email });

  res.send(result);
});

// Check Request Status?
const checkRequestedStatus = tryCatch(async (req, res) => {
  const { user_email } = req.headers;

  const teacherReqCollection = await connectDB('teacher_requests');
  const result = await teacherReqCollection.findOne({
    email: user_email,
  });

  res.send(result);
});

module.exports = {
  getUsers,
  getSlides,
  getClasses,
  getPartners,
  getOverview,
  getFeedBacks,
  getAllClasses,
  getCategories,
  getProfileInfo,
  getClassDetails,
  getClassProgress,
  getStudentEnrolls,
  getTeacherClasses,
  getTeacherRequests,
  getClassAssignments,
  checkRequestedStatus,
};
