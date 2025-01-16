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

module.exports = { updateTechReq };
