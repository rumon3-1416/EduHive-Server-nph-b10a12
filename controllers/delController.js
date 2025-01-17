const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/database');
const { tryCatch } = require('../utils/tryCatch');

// Delete Class
const delClass = tryCatch(async (req, res) => {
  const { id } = req.params;

  const classCollection = await connectDB('classes');
  const result = await classCollection.deleteOne({ _id: new ObjectId(id) });

  res.send(result);
});

module.exports = { delClass };
