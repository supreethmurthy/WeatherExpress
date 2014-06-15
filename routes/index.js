var http = require("http");
var https = require("https");

exports.getWeather = function(req, res) {
	// Log the input params
	console.log(req.query);
	var cities = [ 'CA/Campbell', 'NE/Omaha', 'TX/Austin', 'MD/Timonium' ];
	var weatherInformationList = [];
	for ( var i = 0; i < cities.length; i++) {
		var options = {
			host : 'api.wunderground.com',
			port : 80,
			path : '/api/26f0e1bccd1c0715/conditions/q/',
			method : 'GET',
			headers : {
				'Content-Type' : 'application/json'
			}
		};
		options.path = options.path + cities[i] + ".json";

		var request = http
				.request(
						options,
						function(response) {
							var output = '';
							response.setEncoding('utf8');
							response.on('data', function(chunk) {
								output += chunk;
							});

							response
									.on(
											'end',
											function() {
												var obj = JSON.parse(output);
												if (obj['current_observation'] != null) {
													// Store Weather and city
													// information in a
													// Javascript object
													var city = obj['current_observation']['display_location']['full'];
													var temp = obj['current_observation']['temp_f'];
													var weatherInformation = {
														city : city,
														temp : temp
													};

													weatherInformationList
															.push(weatherInformation);
													if (weatherInformationList.length == 4)
														res
																.render(
																		'index',
																		{
																			"weatherInformationList" : weatherInformationList
																		});
												}
											});
						});

		request.on('error', function(err) {
			console.log(err.message);
		});
		request.end();
	}

};
