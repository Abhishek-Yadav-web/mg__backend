const express = require('express');
const {userRegister,validateUser, getUserInfo, sendMessage} = require('../controller/userController');
const router = express.Router();

// register
router.post('/resigter',userRegister);
router.post('/validate/otp/:otp',validateUser);
router.get('/user/:email',getUserInfo);
router.post('/user/sendMessage',sendMessage)






module.exports = router