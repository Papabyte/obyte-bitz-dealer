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
- edit `credential.js` with your Bit-z API keys and trade password
- edit `trading_conf.js` according to strategy


## Run 

- execute `node dealer.js` to run the software

Every 30 seconds, it will cancel all your Bit-Z orders, get the last price on Bittrex and place new orders on Bit-Z. It doesn't check if you have enough balance, in this case an error will be returned and shown in console. You can refer to https://apidoc.bit-z.com/en/Error-code/Error-code-comparison-table.html for knowing the signification of any error code.
If you run the script on a remote server, it's recommended to use [screen](https://linuxize.com/post/how-to-use-linux-screen/) to detach it from console.