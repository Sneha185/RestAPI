const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth');
const userController = require('../controllers/users');

router.post('/signup', userController.user_signup);

router.post('/login', userController.user_login);

router.delete('/:userId', checkAuth, userController.user_delete)

module.exports = router;