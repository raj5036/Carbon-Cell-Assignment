const {Web3} = require("web3");
const { error } = require("../utils/responseApi");
const CHAINSTACK_ENDPOINT = "https://nd-086-359-007.p2pify.com/cd8178f6db114b5bcdb80a07b403086e";
const INFURA_ENDPOINT = "https://goerli.infura.io/v3/4e9efc91574b46e991ad72d833cafde0";
const check = "https://arbitrum-mainnet.infura.io/42161"
const web3 = new Web3(new Web3.providers.HttpProvider(check));

exports.getEthereumBalance = async (req, res) => {
	try {
		const { accountAddr } = req.body;
		const balance = await web3.eth.getBalance(accountAddr);
		
		return res.status(200).json({message: balance.toString()})
	} catch (e) {
		console.log("Error in generating Password Hash", e);
		res.status(500).json(error("FAILURE", res.statusCode, e));
	}
};