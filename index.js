require('dotenv').config();

const express = require('express');
const validate = require("express-validation");
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const { authenticateToken } = require('./middlewares/AuthMiddleware');
const validator = require('./middlewares/Validator');
const authRoutes = require('./routes/authRoutes');
const DataFetchController = require('./controllers/DataFetchController');
const { success } = require('./utils/responseApi');

const app = express();

app.use(express.json());

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/auth", authRoutes);
app.get(
	'/fetch-data', 
	authenticateToken, 
	validate(validator.dataFetchValidator),
	DataFetchController.fetchData
);

// Protected Routes
app.get('/post', authenticateToken, (req, res) => {
	/* 
		#swagger.tags = ['GetPosts']
		#swagger.summary = 'This is a demo API for retreiving Posts.'
		#swagger.description = 'This API is only works for authorized users'
		#swagger.consumes = ['application/json']
		#swagger.produces = ['application/json']
		#swagger.responses[200] = {
			description: 'Operation is successful',
			schema: {
				message: "SUCCESS",
				result: {},
				code: 200,
			}
		}
  */
	const { username } = req.user;
	const result = {
		username,
		posts: [{
			id: 1,
			title: "post title",
			content: "post content", 
		}]
	};
	res.status(200).json(success("SUCCESS", result, res.statusCode))
});

app.use(validator.checkValidationError);


const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log("App is running on PORT:", PORT)
});