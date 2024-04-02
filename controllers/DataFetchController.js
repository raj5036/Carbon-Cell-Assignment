const { success, error } = require("../utils/responseApi");

exports.fetchData = async (req, res) => {
	try {
		const { category, limit } = req.query;
		/* 
			#swagger.tags = ['Data Retrieval API']
			#swagger.summary = 'Retrieves data from Public API'
			#swagger.description = 'This API fetches data from Public API and filters them by Category 
									& returns result within given Limit'
			#swagger.responses[200] = {
				description: 'Fetched data successfully',
				schema: {
					message: "SUCCESS",
					result: {},
					code: 200,
				}
			}
			#swagger.responses[500] = {
				description: 'Something went wrong. Internal Server Error.',
				schema: { $ref: '#/definitions/errorResponse.500' }
			}
  		*/
		const PUBLIC_URL = "https://api.publicapis.org/entries";
		let response = await fetch(PUBLIC_URL, {});
		response = await response.json();
		
		const result = response.entries
			.filter(entry => entry.Category === category)
			.slice(0, limit);

		res.status(200).json(success("SUCCESS", result, res.statusCode));
	} catch (e) {
		res.status(500).json(error("FAILURE", res.statusCode, e));
	}
};