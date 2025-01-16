require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { MongoClient, ServerApiVersion } = require('mongodb');
// Token
const { postJwtToken } = require('./controllers/jwtController');
// Middlewares

// Controllers
const {
  getSlides,
  getClasses,
  getFeedBacks,
  getOverview,
  getClassDetails,
  getTeacherRequests,
} = require('./controllers/getController');
const { verifyToken } = require('./middlewares/verifyToken');
const { createIntent } = require('./controllers/stripeController');
const {
  postTransaction,
  postUser,
  postTeacherReq,
} = require('./controllers/postController');
const { verifyAdmin } = require('./middlewares/verifyAdmin');

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

const corsOption = {
  origin: [
    'http://localhost:5173',
    'https://assignment-12-26ee0.web.app',
    'https://assignment-12-26ee0.firebaseapp.com',
  ],
  credentials: true,
};
// app use
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello');
});

// Mongodb Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let isConnected = false;

(async () => {
  try {
    !isConnected &&
      (await client.connect(), (isConnected = true), console.log('Connected'));
    const database = client.db('a12DB');

    // Collections
    const slideCollection = database.collection('banner_slides');
    const classCollection = database.collection('classes');
    const feedbackCollection = database.collection('feedbacks');
    const userCollection = database.collection('users');
    const transactionCollection = database.collection('transactions');
    const teacherReqCollection = database.collection('teacher_requests');

    // Jwt Token
    app.post('/jwt', postJwtToken);

    // *** Get Starts ***
    // Banner Slides
    app.get(
      '/slides',
      async (req, res) => await getSlides(req, res, slideCollection)
    );
    // Classes
    app.get(
      '/classes',
      async (req, res) => await getClasses(req, res, classCollection)
    );
    // Feedbacks
    app.get(
      '/feedbacks',
      async (req, res) => await getFeedBacks(req, res, feedbackCollection)
    );
    // Overview
    app.get(
      '/overview',
      async (req, res) =>
        await getOverview(req, res, { classCollection, userCollection })
    );
    // Class Details
    app.get('/class_details/:id', verifyToken, async (req, res) =>
      getClassDetails(req, res, classCollection)
    );
    // Teacher Requests
    app.get('/teacher_requests', verifyToken, verifyAdmin, async (req, res) =>
      getTeacherRequests(req, res, teacherReqCollection)
    );
    // *** Get Ends ***

    // *** Post Starts ***
    // Post User
    app.post(
      '/users',
      async (req, res) => await postUser(req, res, userCollection)
    );
    // Create Payment Secret
    app.post(
      '/create_payment_intent',
      verifyToken,
      async (req, res) => await createIntent(req, res, classCollection)
    );
    // Save Transaction
    app.post('/transactions', verifyToken, async (req, res) =>
      postTransaction(req, res, transactionCollection)
    );
    // add Teacher Request
    app.post('/teacher_request', verifyToken, async (req, res) =>
      postTeacherReq(req, res, teacherReqCollection)
    );
    // *** Post Ends ***
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
