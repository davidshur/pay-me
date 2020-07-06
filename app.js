const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Process running on port ${port}!`));
