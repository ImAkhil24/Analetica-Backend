const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line no-unused-vars
const { isValidEmail, validatePassword, isEmpty, empty } = require('../helpers/validations');

const { successMessage, errorMessage, status } = require('../helpers/status');

const dbQuery = require('../db/dev/dbQuery');

const createUser = async (req, res) => {
  const { email, password, passwordVerify, displayName } = req.body;
  const createdAt = moment(new Date()); // Learn more about this

  // will improve on this later by using some package
  if (isEmpty(email) || isEmpty(displayName) || isEmpty(password)) {
    errorMessage.error = 'Email, password, display name field cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }

  if (!isValidEmail(email)) {
    errorMessage.error = 'Please enter a valid Email';
    return res.status(status.bad).send(errorMessage);
  }

  if (password !== passwordVerify) {
    return res.status(status.bad).json({ errorMessage: 'Please enter the same password twice.' });
  }

  if (!validatePassword(password)) {
    errorMessage.error = 'Password must be more than five(5) characters';
    return res.status(status.bad).send(errorMessage);
  }

  // now check that whether an account with this email already exist or not
  // we can also reuse /api/email route
  const findEmailQuery = `SELECT email
  FROM users
  WHERE email = $1 ;`;

  let { rows } = await dbQuery.query(findEmailQuery, [email]);

  // console.log(rows[0]); is user not present then it will be undefined

  if (rows[0]) {
    return res.status(status.bad).json({ errorMessage: 'An account with this email already exists.' });
  }

  // hash the password

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  // console.log(passwordHash);

  // save a new user account to the database
  const createUserQuery = `INSERT INTO
    users(email, createdAt, password, displayName)
    VALUES($1, $2, $3, $4)
    returning *;`;

  const values = [email, createdAt, passwordHash, displayName];
  // how to handle unique conditions?
  try {
    ({ rows } = await dbQuery.query(createUserQuery, values));
    const dbResponse = rows[0]; // the recent row that we added

    // now after signup log the user in

    // log the user
    // sign a token
    const token = jwt.sign(
      {
        user: dbResponse.userid,
      },
      process.env.JWT_SECRET
    );

    // console.log(token);
    // send the token in a HTTP only cookie
    successMessage.data = dbResponse;
    return res
      .status(status.created)
      .cookie('token', token, {
        httpOnly: true,
      })
      .send(successMessage);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      // understand how would we know tht _bt_check unique should come
      errorMessage.error = 'User with that EMAIL already exist';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const getUser = async (req, res) => {
  const { email } = req.params;
  // add validations in future
  const getUserDetailsQuery = `SELECT createdAt, displayName
  FROM users
  WHERE email = $1 ;`;

  const getWebsiteDetail = `SELECT websiteId, websiteName, baseUrl
  FROM website
  where userId in (SELECT userId
                   FROM users
                   WHERE email = $1);`;

  const getPageDetail = `SELECT route, baseUrl, pageHits
  FROM pages 
  where websiteId = $1;`;

  const getHitDetail = `SELECT visitors, uniqueVisitors, timeStamp, route
  FROM hits
  where websiteID = $1;`;

  // extract the website id from the websiteDetail query
  try {
    let { rows } = await dbQuery.query(getUserDetailsQuery, [email]);
    [successMessage.data.userDetail] = rows;
    ({ rows } = await dbQuery.query(getWebsiteDetail, [email]));
    [successMessage.data.websiteDetail] = rows;
    let [{ websiteid }] = rows;
    websiteid = Number(websiteid);
    ({ rows } = await dbQuery.query(getPageDetail, [websiteid]));
    [successMessage.data.pageDetail] = rows;
    ({ rows } = await dbQuery.query(getHitDetail, [websiteid]));
    [successMessage.data.hitDetail] = rows;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    // console.log(error);
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate
    if (isEmpty(email) || isEmpty(password)) {
      errorMessage.error = 'Email, password, display name field cannot be empty';
      return res.status(status.bad).send(errorMessage);
    }
    const findByEmailQuery = `SELECT *
  FROM users
  WHERE email = $1 ;`;

    const { rows } = await dbQuery.query(findByEmailQuery, [email]);

    if (!rows[0]) {
      return res.status(status.unauthorized).json({ errorMessage: 'Wrong email or password.' });
    }

    // password verify

    const passwordCorrect = await bcrypt.compare(password, rows[0].password);

    if (!passwordCorrect) {
      return res.status(status.unauthorized).json({ errorMessage: 'Wrong email or password.' });
    }

    const dbResponse = rows[0]; // the recent row that we added

    // now after signup log the user in

    // log the user
    // sign a token
    const token = jwt.sign(
      {
        user: dbResponse.userid,
      },
      process.env.JWT_SECRET
    );

    // console.log(token);
    // send the token in a HTTP only cookie
    successMessage.data = dbResponse;
    return res
      .status(status.success)
      .cookie('token', token, {
        httpOnly: true,
      })
      .send(successMessage);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const userLogout = async (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
};

module.exports = { createUser, getUser, userLogin, userLogout };
