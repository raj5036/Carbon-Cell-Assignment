const express = require('express');
const validate = require("express-validation");
const Validator = require('../middlewares/Validator');
const Web3Controller = require("../controllers/Web3Controller");

const router = express.Router();

router.get(
	'/balance', 
	validate(Validator.getEthBalanceValidator),
	Web3Controller.getEthereumBalance
);

module.exports = router;