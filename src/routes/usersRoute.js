const express = require('express');

const router = express.Router();

const { createUser, getUser, userLogin, userLogout } = require('../controllers/usersController');

router.post('user/register', createUser);

router.get('user/:email', getUser);

router.post('/login', userLogin);

router.get('/logout', userLogout); // just clear the cookie

module.exports = router;
