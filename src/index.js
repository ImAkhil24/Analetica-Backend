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

// app.use('/api', require('./routes/authRoute'));  not needed ig

// app.get('/api/login', (req, res) => {
//   // have to do the login stuff.
// });

// new things

// const PORT = process.env.port || 3000; // done
// console.log("the server is started on port : ${PORT}"); // done
// console.error(error);  // error stream me bhejta hai
// email aur password ko require krna hai
// set the id of the user to be random (maybe not required)
// app.use(express.json());
// bcrypt algorihtm for hashing
// for authentication there is a thing callsed jwt research about it
// npm jsonwebtoken
// send the token in a HTTP only cookie
// for logout just clear the cookie

// private endpoints
// some endpoints should only be accesible if the user is logged in
// logged in means the browser have that cookie
// cookie parser library parse the incoming cookie into a javascript object

const port = process.env.port || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening to port : ${port}`);
});
