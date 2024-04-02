const joi = require("joi");
const { ValidationError } = require("express-validation");
const { validation } = require("../utils/responseApi");
 
exports.checkValidationError = (err, req, res, next) => {
	if (err instanceof ValidationError) {
		return res.json(validation(err));
	}
	next();
};

exports.registrationValidator = {
	body: {
		username: joi.string().min(5).required(),
		email: joi.string().required(),
		password: joi.string().min(10).required() 
	}
};
exports.loginValidator = {
	body: {
		username: joi.string().min(5).required(),
		password: joi.string().min(10).required() 
	}
};

exports.logoutValidator = {
	body: {
		token: joi.string().required()
	}
}

exports.dataFetchValidator = {
	query: {
		category: joi.string().required(),
		limit: joi.number().positive().required()
	}
};