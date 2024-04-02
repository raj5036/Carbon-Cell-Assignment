const { success, error } = require("../utils/responseApi");

exports.fetchData = async (req, res) => {
	try {
		const { category, limit } = req.query;
		const PUBLIC_URL = "https://api.publicapis.org/entries";
		let response = await fetch(PUBLIC_URL, {});
		response = await response.json();
		
		const result = response.entries
			.filter(entry => entry.Category === category)
			.slice(0, limit);

		res.status(200).json(success("SUCCESS", result, res.statusCode))
		// res.status(200).json({
		// 	code: "SUCCESS",
		// 	result
		// });
	} catch (e) {
		res.status(500).json(error("FAILURE", res.statusCode, e))
		// res.status(500).json({
		// 	code: "FAILURE",
		// 	message: e
		// });
	}
};