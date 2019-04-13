

const publicUrlBase = "https://bittrex.com/api/v1.1/public/"
const request = require("request");

function getAvgBuyPriceForQuantity (pair, qty, handle) {
	
	request({
		url: publicUrlBase + "getorderbook?market="+ pair + "&type=buy"
	}, 
	function(error, response, body) {
		if (error || response.statusCode !== 200) {
			return handle(error)
		}		
		
		try {
			var parsedBody = JSON.parse(body);
		} catch (e) {
			return handle(e);
		}
		if (!parsedBody.success)
			return handle("Invalid body: " + body);

		let totalQtySold = 0;
		let totalReceived = 0;
		let qtyLeft = qty;

		for (let i = 0; i < parsedBody.result.length; i++){
			qtyLeft -= parsedBody.result[i].Quantity;
			if (qtyLeft <= 0){
				totalQtySold += qtyLeft;
				totalReceived += qtyLeft * parsedBody.result[i].Rate;
				return handle(null, totalReceived/totalQtySold);
			} else{
				totalQtySold += parsedBody.result[i].Quantity;
				totalReceived += parsedBody.result[i].Quantity * parsedBody.result[i].Rate;
			}
		}
		return handle("market not deep enough");
	});
}

function getAvgSellPriceForQuantity (pair, qty, handle) {
	
	request({
		url: publicUrlBase + "getorderbook?market="+ pair + "&type=sell"
	}, 
	function(error, response, body) {
		if (error || response.statusCode !== 200) {
			return handle(error)
		}		
		
		try {
			var parsedBody = JSON.parse(body);
		} catch (e) {
			return handle(e);
		}
		if (!parsedBody.success)
			return handle("Invalid body: " + body);

		let totalQtyBought = 0;
		let totalPaid = 0;
		let qtyLeft = qty;

		for (let i = 0; i < parsedBody.result.length; i++){
			qtyLeft -= parsedBody.result[i].Quantity;
			if (qtyLeft <= 0){
				totalQtyBought += qtyLeft;
				totalPaid += qtyLeft * parsedBody.result[i].Rate;
				return handle(null, totalPaid/totalQtyBought);
			} else{
				totalQtyBought += parsedBody.result[i].Quantity;
				totalPaid += parsedBody.result[i].Quantity * parsedBody.result[i].Rate;
			}
		}
		return handle("market not deep enough");
	});
}

exports.getAvgBuyPriceForQuantity = getAvgBuyPriceForQuantity;
exports.getAvgSellPriceForQuantity = getAvgSellPriceForQuantity;