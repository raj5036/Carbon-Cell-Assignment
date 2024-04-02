const express = require('express');
const validate = require("express-validation");
const UserController = require('../controllers/UserController');
const Validator = require('../middlewares/Validator');

const router = express.Router();

/* @swagger
* /registration:
* POST:
* summary: Register a new user
* description: Register a new user with unique username, email amd a password.
* parameters:
* — in: path
* name: id
* required: true
* description: ID of the resource to retrieve.
* schema:
* type: string
* responses:
* 200:
* description: Successful response
*/
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
router.delete('/logout', UserController.logout);

module.exports = router;