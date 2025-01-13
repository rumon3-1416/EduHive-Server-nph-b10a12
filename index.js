require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
// Token
const { postJwtToken, clearJwtToken } = require('./controllers/jwtController');
// Middlewares

// Controllers
const { getSlides } = require('./controllers/getController');

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

const corsOption = {
  origin: ['http://localhost:5173'],
  credentials: true,
};
// app use
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

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

    // Jwt Token
    app.post('/jwt', postJwtToken);
    app.post('/logout', clearJwtToken);

    // Get
    app.get(
      '/slides',
      async (req, res) => await getSlides(req, res, slideCollection)
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
