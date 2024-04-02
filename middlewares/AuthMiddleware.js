const jwt = require("jsonwebtoken");
const {error} = require("../utils/responseApi");

exports.authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null){ 
		return res.sendStatus(401).json(error("UnAuthorized", res.statusCode, null));
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
		if (error) {
			return res.sendStatus(403).json(error("Forbidden: Access is denied", res.statusCode, null));
		}
		req.user = user;
		next();
	})
};