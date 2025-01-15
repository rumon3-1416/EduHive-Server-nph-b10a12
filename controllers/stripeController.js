const { tryCatch } = require('../utils/tryCatch');
const stripe = require('stripe')(process.env.STRIPE_SK);

const createIntent = tryCatch(async (req, res) => {
  const price = 25;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  res.send({ client_secret: paymentIntent.client_secret });
});

module.exports = { createIntent };
