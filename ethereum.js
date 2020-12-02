const { CustomProvider } = require('eraswap-sdk');
const ethers = require('ethers');

// const providerESN = new CustomProvider(process.env.NODE_ENV !== 'production' ? 'testnet' : 'mainnet');
const providerESN = new ethers.providers.JsonRpcProvider(process.env.NODE_ENV !== 'production' ? 'https://testnet.eraswap.network' : 'https://mainnet.eraswap.network');
module.exports ={
    providerESN
}