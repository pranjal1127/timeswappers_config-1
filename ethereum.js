const { CustomProvider, typechain, addresses } = require('eraswap-sdk');
const ethers = require('ethers');
const { distributeIncentiveABI } = require('./ESN/DistributeIncentive');

const customProvider = new CustomProvider(process.env.NODE_ENV !== 'production' ? 'testnet' : 'mainnet');
const providerESN = new ethers.providers.JsonRpcProvider(process.env.NODE_ENV !== 'production' ? 'https://testnet.eraswap.network' : 'https://mainnet.eraswap.network');

    const dayswappersInst = typechain.ESN.DayswappersWithMigrationFactory.connect(
    addresses[process.env.NODE_ENV].ESN.dayswappers ,
    customProvider
    );
const distributeIncentiveInst = new ethers.Contract('0x4a64095E0f4Fcf0fF201FF0984E928908c269F25',
  distributeIncentiveABI,
  new ethers.providers.JsonRpcProvider('https://mainnet.eraswap.network')
  );

module.exports ={
    providerESN,
    dayswappersInst,
    customProvider,
    distributeIncentiveInst
}