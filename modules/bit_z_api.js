const credentials = require("../credentials.js");
const crypto = require("crypto");
const request = require("request");
const urlBase = "https://apiv2.bit-z.pro/";

function getMyAssets(handle){
	sendRequest("Assets/getUserAssets",{},function(error, parsedBody){
		if (!parsedBody.data || !Array.isArray(parsedBody.data.info))
			return handle("unexpected response:\n " + body);
		
		const objBalances = {};
		parsedBody.data.info.forEach(function(asset){
			objBalances[asset.name] = {};
			objBalances[asset.name].total = asset.num;
			objBalances[asset.name].free = asset.over;
			objBalances[asset.name].onOrder = asset.lock;
		});
		return handle(null, objBalances);

	});
}

function cancelAllOrders(handle){

	sendRequest("Trade/getUserNowEntrustSheet",{pageSize:100},function(error, parsedBody){


		if (!parsedBody.data)
			return handle("unexpected response:\n " + body);

		if (!parsedBody.data.data)
			return handle(null); // no order to cancel
		
		if (!Array.isArray(parsedBody.data.data))
			return handle("unexpected response:\n " + body);

		const ordersToBeDeleted = []

		parsedBody.data.data.forEach(function(order){
			ordersToBeDeleted.push(order.id)
		});

		sendRequest("Trade/cancelAllEntrustSheet",{ids: ordersToBeDeleted.join(',')},function(error){
				return handle(error);
		});
	});
}

function sellGBToUSDT(qty, price, handle){
	sendRequest("Trade/addEntrustSheet",{
		type:2,
		symbol:'gbyte_usdt', 
		number: qty, 
		price: price,
		tradePwd : credentials.bit_z_trade_password
	},function(error, body){
		return handle(error)
	});
}



function sellGBToBTC(qty, price, handle){
	sendRequest("Trade/addEntrustSheet",{
		type:2,
		symbol:'gbyte_btc', 
		number: qty, 
		price: price,
		tradePwd : credentials.bit_z_trade_password
	},function(error, body){
		return handle(error)
	});
}

function buyGBWithUSDT(qty, price, handle){
	sendRequest("Trade/addEntrustSheet",{
		type:1,
		symbol:'gbyte_usdt', 
		number: qty, 
		price: price,
		tradePwd : credentials.bit_z_trade_password
	},function(error, body){
		return handle(error)
	});
}


function buyGBWithBTC(qty, price, handle){
	sendRequest("Trade/addEntrustSheet",{
		type:1,
		symbol:'gbyte_btc', 
		number: qty, 
		price: price,
		tradePwd : credentials.bit_z_trade_password
	},function(error, body){
		return handle(error)
	});
}

function sendRequest(path, params, handle){

	addKeyNonceAndSignature(params);
	let httpOptions = {
		url: urlBase + path,
		form: params,
		method: 'post',
		timeout: 3000
	};

	request(httpOptions, function(error, response, body) {
		if (error || response.statusCode !== 200) {
			return handle(error)
		}
		try{
			var parsedBody =	JSON.parse(body);

		}catch(e){
			return handle(e);
		}
		if (parsedBody.status != 200)
			return handle("request error code: " + parsedBody.status);
		return handle(null, parsedBody);
	});
}


function generateNonce(){
	return crypto.randomBytes(Math.ceil(3)).toString('hex').slice(0, 6);
}

function addKeyNonceAndSignature(params){

	params.apiKey = credentials.bit_z_API_key;
	params.timeStamp = Math.round(Date.now()/1000);
	params.nonce =  generateNonce();
	
	let keys = Object.keys(params);
	keys = keys.sort();
	let stringToBeSigned = '';
	for (let i = 0; i < keys.length; i++) {
		if (stringToBeSigned !== '') 
			stringToBeSigned += "&";
		stringToBeSigned = stringToBeSigned + keys[i] + "=" + params[keys[i]];
	}

	stringToBeSigned += credentials.bit_z_API_secret;
	params.sign =  crypto.createHash('md5').update(stringToBeSigned).digest("hex");
	return params;
}

exports.getMyAssets = getMyAssets;
exports.cancelAllOrders = cancelAllOrders;
exports.sellGBToBTC = sellGBToBTC;
exports.buyGBWithBTC = buyGBWithBTC;
exports.sellGBToUSDT = sellGBToUSDT;
exports.buyGBWithUSDT = buyGBWithUSDT;