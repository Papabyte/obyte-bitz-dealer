//refresh period
exports.refreshTimeInSec = 30;

//profit margins in percent
exports.GB_to_BTC_margin = 3; 
exports.BTC_to_GB_margin = 3; 
exports.GB_to_USDT_margin = 3; 
exports.USDT_to_GB_margin = 3; 

//order size in GB
exports.GB_to_BTC_batch_size = 1;
exports.BTC_to_GB_batch_size = 1;
exports.GB_to_USDT_batch_size = 1; 
exports.USDT_to_GB_batch_size = 0.2;

//min and max prices
exports.minGBSellingPriceInBTC = 0.008;
exports.maxGBBuyingPriceInBTC = 0.012;
exports.minGBSellingPriceInUSDT = 40;
exports.maxGBBuyingPriceInUSDT = 60;