const bittrexAPI = require("./modules/bittrex_api");
const bitzAPI = require("./modules/bit_z_api");
const logger = require("./modules/logger");
const tradingConf = require("./trading_conf");
const credentials = require("./credentials.js");

checkConfig();

getLastPricesAndReplaceOrders();
var intervalId = setInterval(getLastPricesAndReplaceOrders, tradingConf.refreshTimeInSec * 1000);

function getLastPricesAndReplaceOrders() {
	console.log("\n" + new Date().toUTCString());
	bitzAPI.cancelAllOrders(function(err) {
		if(err)
			return console.log(err);
		logger.info("previous orders canceled");
		console.log("previous orders canceled");
		placeBuyOrders();
		placeSellOrders();
	});
}


function placeBuyOrders() {

	bittrexAPI.getAvgBuyPriceForQuantity("BTC-GBYTE", tradingConf.BTC_to_GB_batch_size, function(err, price_btc_gb) {
		logger.info("BTC-GBYTE getAvgBuyPriceForQuantity " + price_btc_gb);

		if(err)
			return console.log(err);

		let myBuyingPriceInBTC = price_btc_gb * (1 - tradingConf.GB_to_BTC_margin / 100);

		if(myBuyingPriceInBTC > tradingConf.maxGBBuyingPriceInBTC) {
			logger.info(myBuyingPriceInBTC +" BTC max buying price exceeded");
			console.log("max buying price exceeded");
		} else if(tradingConf.BTC_to_GB_batch_size > 0) {
			console.log("will place buy order at " + myBuyingPriceInBTC + " BTC for " + tradingConf.BTC_to_GB_batch_size + "GB");
			logger.info("will place buy order at " + myBuyingPriceInBTC + " BTC for " + tradingConf.BTC_to_GB_batch_size + "GB");
			bitzAPI.buyGBWithBTC(tradingConf.BTC_to_GB_batch_size, myBuyingPriceInBTC, function(err) {
				if(err)
					console.log(err)
			});
		}

		if (tradingConf.USDT_to_GB_batch_size === 0)
			return;

		bittrexAPI.getAvgBuyPriceForQuantity("USDT-BTC", tradingConf.USDT_to_GB_batch_size * price_btc_gb, function(err, price_usdt_btc) {
			logger.info("USDT-BTC getAvgBuyPriceForQuantity " + price_btc_gb * price_usdt_btc);

			if(err)
				return console.log(err);
			let myBuyingPriceInUSDT = price_btc_gb * price_usdt_btc * (1 - tradingConf.USDT_to_GB_margin / 100);
			if(myBuyingPriceInUSDT > tradingConf.maxGBBuyingPriceInUSDT){
				logger.info(myBuyingPriceInUSDT +" USDT max buying price exceeded");
				return console.log("max buying price exceeded");
			} 
			console.log("will place buy order at " + myBuyingPriceInUSDT + " USDT for " + tradingConf.USDT_to_GB_batch_size + "GB");
			logger.info("will place buy order at " + myBuyingPriceInUSDT + " USDT for " + tradingConf.USDT_to_GB_batch_size + "GB");

			bitzAPI.buyGBWithUSDT(tradingConf.USDT_to_GB_batch_size, myBuyingPriceInUSDT, function(err) {
				if(err)
					console.log(err)
			});
		});
	});

}

function placeSellOrders() {

	bittrexAPI.getAvgSellPriceForQuantity("BTC-GBYTE", tradingConf.GB_to_BTC_batch_size, function(err, price_btc_gb) {
		logger.info("BTC-GBYTE getAvgSellPriceForQuantity " + price_btc_gb);
		if(err)
			return console.log(err);

		let mySellingPriceInBTC = price_btc_gb * (1 + tradingConf.BTC_to_GB_margin / 100);
		if(mySellingPriceInBTC < tradingConf.minGBSellingPriceInBTC) {
			logger.info(mySellingPriceInBTC +" BTC under min selling price");
			console.log("under minGBSellingPriceInBTC");
		} else if(tradingConf.GB_to_BTC_batch_size > 0) {
			console.log("will place sell order at " + mySellingPriceInBTC + " BTC for " + tradingConf.GB_to_BTC_batch_size + "GB");
			logger.info("will place sell order at " + mySellingPriceInBTC + " BTC for " + tradingConf.GB_to_BTC_batch_size + "GB");

			bitzAPI.sellGBToBTC(tradingConf.GB_to_BTC_batch_size, mySellingPriceInBTC, function(err) {
				if(err)
					console.log(err)
			});
		}

		if (tradingConf.GB_to_USDT_batch_size === 0)
			return;

		bittrexAPI.getAvgSellPriceForQuantity("USDT-BTC", tradingConf.GB_to_USDT_batch_size * price_btc_gb, function(err, price_usdt_btc) {
			logger.info("USDT-BTC getAvgSellPriceForQuantity " + price_btc_gb * price_usdt_btc);
			if(err)
				return console.log(err);
			let mySellingPriceInUSDT = price_btc_gb * price_usdt_btc * (1 + tradingConf.GB_to_USDT_margin / 100);
			if(mySellingPriceInUSDT < tradingConf.minGBSellingPriceInUSDT){
				logger.info(mySellingPriceInUSDT +" USDT under min selling price");
				return console.log("under minGBSellingPriceInUSDT");
			}
			console.log("will place sell order at " + mySellingPriceInUSDT + " USDT for " + tradingConf.GB_to_USDT_batch_size + "GB");
			logger.info("will place sell order at " + mySellingPriceInUSDT + " USDT for " + tradingConf.GB_to_USDT_batch_size + "GB");

			bitzAPI.sellGBToUSDT(tradingConf.GB_to_USDT_batch_size, mySellingPriceInUSDT, function(err) {
				if(err)
					console.log(err)
			});
		});
	});
}

function checkConfig(){
	checkIfPositiveNumber(tradingConf,"refreshTimeInSec");

	checkIfNonNegativeNumber(tradingConf, "GB_to_BTC_margin");
	checkIfNonNegativeNumber(tradingConf, "BTC_to_GB_margin");
	checkIfNonNegativeNumber(tradingConf, "GB_to_USDT_margin");
	checkIfNonNegativeNumber(tradingConf, "USDT_to_GB_margin");

	checkIfNonNegativeNumber(tradingConf, "GB_to_BTC_batch_size");
	checkIfNonNegativeNumber(tradingConf, "BTC_to_GB_batch_size");
	checkIfNonNegativeNumber(tradingConf, "GB_to_USDT_batch_size");
	checkIfNonNegativeNumber(tradingConf, "USDT_to_GB_batch_size");

	checkIfNonNegativeNumber(tradingConf, "minGBSellingPriceInBTC");
	checkIfNonNegativeNumber(tradingConf, "maxGBBuyingPriceInBTC");
	checkIfNonNegativeNumber(tradingConf, "minGBSellingPriceInUSDT");
	checkIfNonNegativeNumber(tradingConf, "maxGBBuyingPriceInUSDT");

	checkIfNonEmptyString(credentials, "bit_z_API_key");
	checkIfNonEmptyString(credentials, "bit_z_API_secret");
	checkIfNonEmptyString(credentials, "bit_z_trade_password");
}

function checkIfNonNegativeNumber (object, key){
	if (!object || !object[key] || typeof object[key] != "number" || object[key] < 0)
		throw Error("Wrong config, " + key + " must be a number >= 0");
}

function checkIfPositiveNumber (object, key){
	if (!object || !object[key] || typeof object[key] != "number" || object[key] <= 0)
		throw Error("Wrong config, " + key + " must be a number > 0");
}

function checkIfNonEmptyString(object, key){
	if (!object || !object[key] || typeof object[key] != "string" || object[key].length === 0)
	throw Error("Wrong config, " + key + " must be a non empty string");
}


//cancel orders when app terminates
function onExit(){
	clearInterval(intervalId);
	bitzAPI.cancelAllOrders(function(err) {
		if(err)
			return console.log(err);
		else
			return console.log("orders canceled");
	});
	process.exit;
}

process.on('SIGTERM', onExit);
process.on('SIGINT', onExit);

process.on('uncaughtException', function(e) {
	onExit();
});