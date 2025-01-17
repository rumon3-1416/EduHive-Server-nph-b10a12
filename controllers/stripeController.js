const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');
const { connectDB } = require('../config/database');
const stripe = require('stripe')(process.env.STRIPE_SK);

// Create Client Secret from Intent
const createIntent = tryCatch(async (req, res) => {
  const { id } = req.body;

  const classCollection = await connectDB('classes');
  const transactionCollection = await connectDB('classes');

  const { price } = await transactionCollection.findOne({
    _id: new ObjectId(id),
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  await classCollection.updateOne(
    { _id: new ObjectId(id) },
    { $inc: { total_enrolment: 1 } }
  );

  res.send({ client_secret: paymentIntent.client_secret });
});

module.exports = { createIntent };
