const express = require('express');

const usersRoute = require('./routes/usersRoute');

const app = express();

// verify the the req object content again by commmenting below code
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.use('/api', usersRoute);

// app.get('/api/login', (req, res) => {
//   // have to do the login stuff.
// });

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening to port 3000');
});
