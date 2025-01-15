const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');
const stripe = require('stripe')(process.env.STRIPE_SK);

// Create Client Secret from Intent
const createIntent = tryCatch(async (req, res, collection) => {
  const { price } = await collection.findOne({
    _id: new ObjectId(req.body.id),
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  res.send({ client_secret: paymentIntent.client_secret });
});

module.exports = { createIntent };
