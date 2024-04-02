const express = require('express');
const validate = require("express-validation");
const UserController = require('../controllers/UserController');
const Validator = require('../middlewares/Validator');

const router = express.Router();

router.post(
	'/registration', 
	validate(Validator.registrationValidator),
	UserController.registration
);
router.post(
	'/login', 
	validate(Validator.loginValidator),
	UserController.login
);
router.delete(
	'/logout', 
	validate(Validator.logoutValidator),
	UserController.logout
);

module.exports = router;