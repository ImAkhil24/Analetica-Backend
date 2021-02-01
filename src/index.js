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

// app.get('/api/login', (req, res) => {
//   // have to do the login stuff.
//   // email aur password extract using body parser
//   // datbase me srch krunga fir password hash krunga dono ko compare krunga
//   // ek token generate krke response frontend ko bhej dunga wo token
// });

app.use('/api', usersRoute);

// // /api/dashboard/(username)
// // username ke correspondin sare data kaisa data?

// // /api/

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listening to port 3000');
});
