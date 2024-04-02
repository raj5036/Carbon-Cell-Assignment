const jwt = require("jsonwebtoken");
const {error} = require("../utils/responseApi");
const { AccessTokens } = require("../database");

exports.authenticateToken = (req, res, next) => {
	/* 
		#swagger.responses[200] = {
			description: 'Authorization is successful',
			schema: {
				message: "SUCCESS",
				result: {},
				code: 200,
			}
		}
		#swagger.responses[401] = {
			description: 'Unauthorized. No Authorization token found.',
			schema: { $ref: '#/definitions/errorResponse.401' }
		}
		#swagger.responses[403] = {
			description: 'Forbidden. Access is denied. Authorization token is invalid',
			schema: { $ref: '#/definitions/errorResponse.403' }
		}
  */
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null){ 
		return res.sendStatus(401).json(error("Unauthorized", res.statusCode, null));
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
		if (error || !AccessTokens.includes(token)) {
			return res.sendStatus(403).json(error("Forbidden. Access is denied", res.statusCode, null));
		}
		req.user = user;
		next();
	})
};