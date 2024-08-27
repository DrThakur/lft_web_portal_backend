const express = require('express');
const {login, forgotPassword, resetPassword} =require("../Controllers/authController")

const router = express.Router();

// router.route('/signup').post(authController.signup);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword').patch(resetPassword);

module.exports = router;