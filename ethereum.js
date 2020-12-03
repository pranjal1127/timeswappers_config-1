const { CustomProvider, typechain, addresses } = require('eraswap-sdk');
const ethers = require('ethers');

const customProvider = new CustomProvider(process.env.NODE_ENV !== 'production' ? 'testnet' : 'mainnet');
const providerESN = new ethers.providers.JsonRpcProvider(process.env.NODE_ENV !== 'production' ? 'https://testnet.eraswap.network' : 'https://mainnet.eraswap.network');

    const dayswappersInst = typechain.ESN.DayswappersWithMigrationFactory.connect(
    addresses[process.env.NODE_ENV].ESN.dayswappers ,
    customProvider
    );
module.exports ={
    providerESN,
    dayswappersInst,
    customProvider
}