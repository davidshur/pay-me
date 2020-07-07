const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

app.get('/', (req, res) => {
  res.send('Hello world!');
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Process running on port ${port}!`));
