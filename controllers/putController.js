const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

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

const makeAdmin = tryCatch(async (req, res) => {
  const { email } = req.body;

  const userCollection = await connectDB('users');
  const result = await userCollection.updateOne(
    { email },
    { $set: { role: 'admin' } }
  );

  res.send(result);
});

module.exports = { updateTechReq, makeAdmin };
