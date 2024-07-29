const express = require('express');
const {login} =require("../Controllers/authController")

const router = express.Router();

// router.route('/signup').post(authController.signup);
router.route('/login').post(login);

module.exports = router;