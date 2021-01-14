const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening to port 3000');
});
