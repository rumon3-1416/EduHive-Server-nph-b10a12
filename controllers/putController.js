const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// Update Teacher Request
const updateTechReq = tryCatch(async (req, res) => {
  const { updatedStatus, id, email } = req.body;

  const teacherReqCollection = await connectDB('teacher_requests');
  const usersCollection = await connectDB('users');

  await teacherReqCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: updatedStatus } }
  );

  if (updatedStatus === 'approved') {
    await usersCollection.updateOne({ email }, { $set: { role: 'teacher' } });
  }

  res.send({ success: true });
});

// Make user Admin
const makeAdmin = tryCatch(async (req, res) => {
  const { email } = req.body;

  const userCollection = await connectDB('users');
  const result = await userCollection.updateOne(
    { email },
    { $set: { role: 'admin' } }
  );

  res.send(result);
});

// Update Class Status
const updateClass = tryCatch(async (req, res) => {
  const { updatedStatus, id } = req.body;

  const classCollection = await connectDB('classes');
  const result = await classCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: updatedStatus } }
  );

  res.send(result);
});

// Update Teacher Class
const updateTeachClass = tryCatch(async (req, res) => {
  const { _id, title, image, price, description } = req.body;

  const classCollection = await connectDB('classes');
  const result = await classCollection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { title, image, price, description } }
  );

  res.send(result);
});

module.exports = { updateTechReq, makeAdmin, updateClass, updateTeachClass };
