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
const { verifyAdmTeach } = require('./middlewares/verifyAdmTeach');
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
  getAllClasses,
  getClassesCount,
  getProfileInfo,
  getTeacherClasses,
  getTeachClassCount,
  getClassProgress,
} = require('./controllers/getController');
const {
  postTransaction,
  postUser,
  postTeacherReq,
  postClass,
  postAssignment,
} = require('./controllers/postController');
const {
  updateTechReq,
  makeAdmin,
  updateClass,
  updateTeachClass,
} = require('./controllers/putController');
const { delClass } = require('./controllers/delController');

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
    // Home Page
    app.get('/slides', getSlides);
    app.get('/overview', getOverview);
    app.get('/feedbacks', getFeedBacks);
    // Classes
    app.get('/classes', getClasses);
    app.get('/class_details/:id', verifyToken, getClassDetails);
    app.get('/all_classes', verifyToken, verifyAdmin, getAllClasses);
    app.get('/classes_count', verifyToken, verifyAdmin, getClassesCount);
    app.get('/my_classes', verifyToken, verifyTeacher, getTeacherClasses);
    app.get('/my_class_count', verifyToken, verifyTeacher, getTeachClassCount);
    app.get(
      '/class_progress/:id',
      verifyToken,
      verifyAdmTeach,
      getClassProgress
    );
    // Users
    app.get('/user_profile', verifyToken, getProfileInfo);
    app.get('/users', verifyToken, verifyAdmin, getUsers);
    app.get('/users_count', verifyToken, verifyAdmin, getUsersCount);
    // Teacher
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
    app.post('/transactions', verifyToken, postTransaction);
    app.post('/teacher_request', verifyToken, postTeacherReq);
    app.post('/create_payment_intent', verifyToken, createIntent);
    app.post('/add_class', verifyToken, verifyTeacher, postClass);
    app.post('/add_assignment', verifyToken, verifyTeacher, postAssignment);
    // *** Post Ends ***

    // *** Put Starts ***
    app.put('/users_admin', verifyToken, verifyAdmin, makeAdmin);
    app.put('/update_class', verifyToken, verifyAdmin, updateClass);
    app.put('/update_teach_req', verifyToken, verifyAdmin, updateTechReq);
    app.patch('/update_my_class', verifyToken, verifyTeacher, updateTeachClass);
    // *** Put Ends ***

    // *** Delete Starts ***
    app.delete('/delete_class/:id', verifyToken, verifyTeacher, delClass);
    // *** Delete Ends ***
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
