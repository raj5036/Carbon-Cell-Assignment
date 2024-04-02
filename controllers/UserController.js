const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users, AccessTokens } = require("../database");
const { error, success } = require('../utils/responseApi');

exports.registration = async (req, res) => {
	try {
		const {username, email, password} = req.body;
		/* 
			#swagger.summary = 'Registration API'
			#swagger.description = 'This API registers new users.'
			#swagger.responses[201] = {
				description: 'User created successfully',
			}
			#swagger.responses[409] = {
				description: 'username already exists',
			}
			#swagger.responses[500] = {
				description: 'Something went wrong. Internal Server Error.',
				schema: { $ref: '#/definitions/errorResponse.500' }
			}
  		*/

		// If username already exists
		const userAlreadyExists = Users.some(user => user.username === username);
		if (userAlreadyExists) {
			return res.status(409).json(error("FAILURE", res.statusCode, "username already exists"));
		}
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const newUser = {
			username,
			email,
			password: passwordHash // Hash it before storing
		}
	
		Users.push(newUser);

		res.status(201).json(success("User successfully created.", null, res.statusCode));
	} catch (e) {
		console.log("Error in generating Password Hash", e);
		res.status(500).json(error("FAILURE", res.statusCode, e));
	}
};

exports.login = async (req, res) => {
	const {username, password} = req.body;
	/* 
		#swagger.summary = 'Login API'
		#swagger.description = 'This API logs in existing users.'
		#swagger.responses[200] = {
			description: 'User successfully logged in',
			schema: {
				message: "User successfully logged in",
				results: {
					accessToken: "",
					refreshToken: ""
				},
				code: 200
			}
		}
		#swagger.responses[400] = {
			description: 'Password is Invalid',
			schema: { $ref: '#/definitions/errorResponse.400' }
		}
		#swagger.responses[404] = {
			description: 'No such user exists',
			schema: { $ref: '#/definitions/errorResponse.404' }
		}
		#swagger.responses[500] = {
			description: 'Something went wrong. Internal Server Error.',
			schema: { $ref: '#/definitions/errorResponse.500' }
		}
	*/

	const users = Users.filter(user => user.username === username);
	if (!users.length) {
		return res.status(404).json(error("FAILURE", res.statusCode, "No such user exists."));
	}
	const user = users[0];
	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) {
		return res.status(400).json(error("FAILURE", res.statusCode, "Password is invalid"));
	}

	// Do JWT Serialization here to authorize
	const accessToken = generateAccessToken(user);
	AccessTokens.push(accessToken);
 
	res.status(200).json(success("User successfully logged in.", {accessToken}, res.statusCode));
}

exports.logout = (req, res) => {
	try {
	/* 
			#swagger.summary = 'Logout API'
			#swagger.description = 'This API logs out existing users.'
			#swagger.responses[204] = {
				description: 'User has been logged out successfully.',
				schema: {
					message: "User has been logged out successfully.",
					results: null,
					code: 204
				}
			}
		*/
		const { token } = req.body;
		if (!AccessTokens.includes(token)) {
			return res.status(404).json(error("FAILURE", res.statusCode, "No such accessToken found"));
		}

		const updatedAccessTokens = AccessTokens.filter(accessToken => accessToken !== token);
		AccessTokens.length = 0;
		updatedAccessTokens.forEach(accessToken => {
			AccessTokens.push(accessToken);
		});
		res.status(204).json(success("User has been logged out successfully.", null, res.statusCode));
	} catch (e) {
		console.log("Error in logging out", e);
		res.status(500).json(error("FAILURE", res.statusCode, e));
	}
}

const generateAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}