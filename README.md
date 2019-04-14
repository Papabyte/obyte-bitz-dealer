# obyte-dealer

This is a very simple arbitrage program for Obyte currency that gets price from Bittrex exchange and place orders on Bit-z with a profit margin you can configure.
This way you provide liquidity to Bit-z exchange while having a chance to buy or sell bytes at a better price than Bittrex main market.

## Installation
The script can run in command-line on Windows, Linux or MacOS. 

- Install git
- Install Nodejs version 8 minimum
- `git clone https://github.com/Papabyte/obyte-dealer.git`
- `cd obyte-dealer`
- `npm install`

## Configuration

- edit `credential.js` with your Bit-z API keys and trade password
- edit `trading_conf.js` for the parameters below according to strategy

#### refresh period
ex: if you set `exports.refreshTimeInSec = 30;`, orders will be updated every 30 seconds.

#### margins
ex: if you set `exports.USDT_to_GB_margin = 4;`, if the average buying price on Bittrex for you size order is 50$ per GB, then a buy order at 48$ will be placed

#### batch size
ex: if you set `exports.GB_to_BTC_batch_size = 1;`, you will place selling order sized at 1GB on BTC-GBYTE pair. This size is also used to probe Bittrex market, the calculated price being the average price you batch size can be sold or bought. 
If you don't won't to buy or sell for a specific pair, set 0 as size.

#### min and max prices
ex: if you set `exports.minGBSellingPriceInBTC = 0.008;`, no selling order below 0.008 BTC per GB will ever be placed whatever is price on Bittrex.

## Run 

- execute `node dealer.js` to run the software

Every 30 seconds, it will cancel all your Bit-Z orders, get the last rates from Bittrex and place new orders on Bit-Z. 
It doesn't check if you have enough balance, in this case an error will be returned and shown in console. 
You can refer to https://apidoc.bit-z.com/en/Error-code/Error-code-comparison-table.html for knowing the signification of any error code.
Although placed orders should be canceled when exiting application, it's recommended to check on your Bit-z account that no outdated orders are pending when you cease to use this program.
If you run the script on a remote server, it's recommended to use [screen](https://linuxize.com/post/how-to-use-linux-screen/) to detach it from console.