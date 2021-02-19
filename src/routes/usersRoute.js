const express = require('express');

const router = express.Router();

const { createUser, getUser } = require('../controllers/usersController');

router.post('/register', createUser);

router.get('/:email', getUser);

module.exports = router;
