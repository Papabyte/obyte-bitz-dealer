const bittrexAPI = require("./modules/bittrex_api");
const bitzAPI = require("./modules/bit_z_api");
const tradingConf = require("./trading_conf");


getLastPricesAndReplaceOrders();
setInterval(getLastPricesAndReplaceOrders, tradingConf.refreshTimeInSec * 1000);

function getLastPricesAndReplaceOrders() {
	console.log("\n" + new Date().toUTCString());
	bitzAPI.cancelAllOrders(function(err) {
		if(err)
			return console.log(err);
		console.log("previous orders canceled")
		placeBuyOrders();
		placeSellOrders();
	});
}


function placeBuyOrders() {

	bittrexAPI.getAvgBuyPriceForQuantity("BTC-GBYTE", tradingConf.GB_to_BTC_batch_size, function(err, price_btc_gb) {
		if(err)
			return console.log(err);

		let myBuyingPriceInBTC = price_btc_gb * (1 - tradingConf.GB_to_BTC_margin / 100);
		console.log("myBuyingPriceInBTC " + myBuyingPriceInBTC);

		if(myBuyingPriceInBTC > tradingConf.maxGBBuyingPriceInBTC) {
			console.log("max buying price exceeded");
		} else if(tradingConf.GB_to_BTC_batch_size > 0) {
			console.log("will place buy order at " + myBuyingPriceInBTC + " BTC for " + tradingConf.GB_to_BTC_batch_size + "GB");
			bitzAPI.buyGBWithBTC(tradingConf.GB_to_BTC_batch_size, myBuyingPriceInBTC, function(err) {
				if(err)
					console.log(err)
			});
		}

		if (tradingConf.USDT_to_GB_batch_size === 0)
			return;

		bittrexAPI.getAvgBuyPriceForQuantity("USDT-BTC", tradingConf.USDT_to_GB_batch_size * price_btc_gb, function(err, price_usdt_btc) {
			let myBuyingPriceInUSDT = price_btc_gb * price_usdt_btc * (1 - tradingConf.USDT_to_GB_margin / 100);
			console.log("myBuyingPriceInUSDT " + myBuyingPriceInUSDT);
			if(myBuyingPriceInUSDT > tradingConf.maxGBBuyingPriceInUSDT){
				return console.log("max buying price exceeded");
			} 
			console.log("will place buy order at " + myBuyingPriceInUSDT + " USDT for " + tradingConf.USDT_to_GB_batch_size + "GB");
			bitzAPI.buyGBWithUSDT(tradingConf.USDT_to_GB_batch_size, myBuyingPriceInUSDT, function(err) {
				if(err)
					console.log(err)
			});
		});
	});

}

function placeSellOrders() {

	bittrexAPI.getAvgSellPriceForQuantity("BTC-GBYTE", tradingConf.BTC_to_GB_batch_size, function(err, price_btc_gb) {
		if(err)
			return console.log(err);

		let mySellingPriceInBTC = price_btc_gb * (1 + tradingConf.BTC_to_GB_margin / 100);
		console.log("mySellingPriceInBTC " + mySellingPriceInBTC);

		if(mySellingPriceInBTC < tradingConf.minGBSellingPriceInBTC) {
			console.log("under minGBSellingPriceInBTC");
		} else if(tradingConf.BTC_to_GB_batch_size > 0) {
			console.log("will place sell order at " + mySellingPriceInBTC + " BTC for " + tradingConf.BTC_to_GB_batch_size + "GB");
			bitzAPI.sellGBToBTC(tradingConf.BTC_to_GB_batch_size, mySellingPriceInBTC, function(err) {
				if(err)
					console.log(err)
			});
		}

		if (tradingConf.GB_to_USDT_batch_size === 0)
			return;

		bittrexAPI.getAvgBuyPriceForQuantity("USDT-BTC", tradingConf.GB_to_USDT_batch_size * price_btc_gb, function(err, price_usdt_btc) {

			let mySellingPriceInUSDT = price_btc_gb * price_usdt_btc * (1 + tradingConf.GB_to_USDT_margin / 100);
			console.log("mySellingPriceInUSDT " + mySellingPriceInUSDT);
			if(mySellingPriceInUSDT < tradingConf.minGBSellingPriceInUSDT)
				return console.log("under minGBSellingPriceInUSDT");
			
			console.log("will place sell order at " + mySellingPriceInUSDT + " USDT for " + tradingConf.GB_to_USDT_batch_size + "GB");

			bitzAPI.sellGBToUSDT(tradingConf.GB_to_USDT_batch_size, mySellingPriceInUSDT, function(err) {
				if(err)
					console.log(err)
			});
		});
	});
}