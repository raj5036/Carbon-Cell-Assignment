const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users, RefreshTokens } = require("../database");

exports.registration = async (req, res) => {
	try {
		const {username, email, password} = req.body;

		// If username already exists
		const userAlreadyExists = Users.some(user => user.username === username);
		if (userAlreadyExists) {
			return res.status(409).json({
				code: "FAILURE",
				message: "username already exists"
			});
		}
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const newUser = {
			username,
			email,
			password: passwordHash // Hash it before storing
		}
	
		Users.push(newUser);
		console.log(Users)

		res.status(201).json({
			code: "SUCCESS",
			message: "User successfully created."
		});
	} catch (e) {
		console.log("Error in generating Password Hash", e);
		res.status(500).json({
			code: "FAILURE",
			message: "Something went wrong " + e 
		});
	}
};

exports.login = async (req, res) => {
	const {username, password} = req.body;

	const users = Users.filter(user => user.username === username);
	if (!users.length) {
		return res.status(404).json({
			code: "FAILURE",
			message: "No such user exists."
		});
	}
	const user = users[0];
	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) {
		return res.status(400).json({
			code: "FAILURE",
			message: "Password is invalid"
		});
	}

	// Do JWT Serialization here to authorize
	const accessToken = generateAccessToken(user);
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	RefreshTokens.push(refreshToken);

	return res.status(200).json({
		code: "SUCCESS",
		accessToken,
		refreshToken
	})
}

exports.logout = (req, res) => {
	refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  	res.status(204).json({
		code: "SUCCESS",
		message: "User has been logged out successfully."
	})
}

const generateAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}