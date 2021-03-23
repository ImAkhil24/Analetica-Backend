const express = require('express');

const router = express.Router();

const { createUser, getUser, userLogin } = require('../controllers/usersController');

router.post('/register', createUser);

router.get('/:email', getUser);

router.post('/login', userLogin);

module.exports = router;
