const express = require('express');
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const userController=require('../controllers/users');

//Handle all requests for /users
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.delete('/:userId',checkAuth, userController.delete_user);

module.exports = router;