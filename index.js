require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Token
const { postJwtToken } = require('./controllers/jwtController');
// Stripe Payment
const { createIntent } = require('./controllers/stripeController');
// Middlewares
const { verifyToken } = require('./middlewares/verifyToken');
const { verifyAdmin } = require('./middlewares/verifyAdmin');
const { verifyTeacher } = require('./middlewares/verifyTeacher');
// Controllers
const {
  getSlides,
  getClasses,
  getFeedBacks,
  getOverview,
  getClassDetails,
  getTeacherRequests,
  getTeachReqCount,
  getUsersCount,
  getUsers,
} = require('./controllers/getController');
const {
  postTransaction,
  postUser,
  postTeacherReq,
} = require('./controllers/postController');
const { updateTechReq } = require('./controllers/putController');

const app = express();
const port = process.env.PORT || 5000;

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

(async () => {
  try {
    // Jwt Token
    app.post('/jwt', postJwtToken);

    // *** Get Starts ***
    app.get('/slides', getSlides);
    app.get('/classes', getClasses);
    app.get('/feedbacks', getFeedBacks);
    app.get('/overview', getOverview);
    app.get('/class_details/:id', verifyToken, getClassDetails);
    app.get('/users_count', verifyToken, verifyAdmin, getUsersCount);
    app.get('/users', verifyToken, verifyAdmin, getUsers);
    app.get('/teacher_requests', verifyToken, verifyAdmin, getTeacherRequests);
    app.get(
      '/teacher_requests_count',
      verifyToken,
      verifyAdmin,
      getTeachReqCount
    );
    // *** Get Ends ***

    // *** Post Starts ***
    app.post('/users', postUser);
    app.post('/create_payment_intent', verifyToken, createIntent);
    app.post('/transactions', verifyToken, postTransaction);
    app.post('/teacher_request', verifyToken, postTeacherReq);
    // *** Post Ends ***

    // *** Put Starts ***
    app.put('/update_teach_req', verifyToken, verifyAdmin, updateTechReq);
    // *** Put Ends ***
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
