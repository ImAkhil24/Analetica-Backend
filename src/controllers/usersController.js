const moment = require('moment');

// eslint-disable-next-line no-unused-vars
const { isValidEmail, validatePassword, isEmpty, empty } = require('../helpers/validations');

const { successMessage, errorMessage, status } = require('../helpers/status');

const dbQuery = require('../db/dev/dbQuery');

const createUser = async (req, res) => {
  const { email, password, displayName } = req.body;
  const createdAt = moment(new Date()); // Learn more about this

  if (isEmpty(email) || isEmpty(displayName) || isEmpty(password)) {
    errorMessage.error = 'Email, password, display name field cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }

  if (!isValidEmail(email)) {
    errorMessage.error = 'Please enter a valid Email';
    return res.status(status.bad).send(errorMessage);
  }

  if (!validatePassword(password)) {
    errorMessage.error = 'Password must be more than five(5) characters';
    return res.status(status.bad).send(errorMessage);
  }

  const createUserQuery = `INSERT INTO
    users(email, createdAt, password, displayName)
    VALUES($1, $2, $3, $4)
    returning *;`;

  const values = [email, createdAt, password, displayName];
  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
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

module.exports = { createUser };
