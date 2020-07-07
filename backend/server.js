const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
require('dotenv').config();

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
const router = express.Router();

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let db = mongoose.connection;
db.once('open', () => console.log('Connected to database!'));
db.on('error', console.error.bind(console, 'MongoDB connection error...'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// Read method...
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// Update method...
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// Delete method...
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// Create method...
router.post('/putData', (req, res) => {
  let data = new Data();
  const { id, message } = req.body;
  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'Invalid inputs...'
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err});
    return res.json({ success: true });
  });
});

// Append /api on API requests...
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, () => console.log(`Process running on port ${port}!`));
