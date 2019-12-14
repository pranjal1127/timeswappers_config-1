const ethers = require('ethers');
const LiquidWithdraw  = require('../models/LiquidWithdraw');
const sendErrorMail = require('./errorMailer');
const Config = require('../models/Config');
let isRunning = false;
let startProcessingWithdrawls;

try {
  // startProcessingWithdrawls();
  const network = process.env.NODE_ENV != 'production' ? 'rinkeby' : 'homestead';
  // console.log(network);
  // console.log(process.env.TIMESWAPPERSWITHDRAWPRIVATEKEY);
  // console.log(process.env.NODE_ENV);
  
  // let config = await
  
  startProcessingWithdrawls = async() => {
    if(!isRunning) {
      isRunning = true;

      
      
      const intervalId = setInterval(looper, 30000);
      async function looper(){
        try {
            const store = {
              esBalanceOfWithdrawlAccount: null,
              txNonce: null
            };
            
          let config = await Config.findOne();
          
            const wallet = new ethers.Wallet(config.withdrawPK, ethers.getDefaultProvider(network)); 
            const erc20Abi = [{ 'constant': !0, 'inputs': [{ 'name': '_owner', 'type': 'address' }], 'name': 'balanceOf', 'outputs': [{ 'name': 'balance', 'type': 'uint256' }], 'payable': !1, 'stateMutability': 'view', 'type': 'function' }, { 'constant': !1, 'inputs': [{ 'name': '_to', 'type': 'address' }, { 'name': '_value', 'type': 'uint256' }], 'name': 'transfer', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': !1, 'stateMutability': 'nonpayable', 'type': 'function' }];
            const esInstance = new ethers.Contract(config.eraswapContractAddress, erc20Abi, wallet);
            // console.log('wallet.address',wallet.address);
            
            store.esBalanceOfWithdrawlAccount = await esInstance.functions.balanceOf(wallet.address);
            store.txNonce = await wallet.getTransactionCount();

            await runDeposit(wallet, esInstance, store);
        }catch(e){
            console.log(e);
            sendErrorMail({ error: e.message || JSON.stringify(e) }).catch(e => console.log(e));
            clearInterval(intervalId);
            isRunning = false;
        }
      }
      looper();
      return true;
    } else {
      return false;
    }
  }; 
}
catch(e){
  console.log(e);
}
async function runDeposit(wallet, esInstance, store) {
  let config = await Config.findOne({ deleted: false });
  let gwei = config && config.gwei ? config.gwei : '20';

  LiquidWithdraw.find({ transactionHash: null })
    .exec(async (err, data) => {
      if (err) console.log(err);

      console.log('data',data);
      
      let i = 0;
      
      if(data && data.length){
        for (let request of data) {
          console.log(request.walletAddress, i++);
          console.log('store',store);
          
          // data[i].nonce = store.txNonce;
          
          const amountToSend = ethers.utils.parseEther(String(request.receivedAmount));
          if (amountToSend.gt(store.esBalanceOfWithdrawlAccount)) {
            // return error inssuffent es balance
            sendErrorMail({ error: 'Eraswap Tokens balance is exhausted,please refill Timeswappers Withdraw Wallet.' });
            break;
          }

          await LiquidWithdraw.findByIdAndUpdate(request._id, { nonce: store.txNonce });

          let tx;
          try{
            tx = await esInstance.functions.transfer(request.walletAddress, amountToSend, {
              nonce: store.txNonce,
              gasPrice: ethers.utils.parseUnits(gwei, 'gwei')
            });
          } catch (e) {
            console.log(e);
            return sendErrorMail({ error: 'Eraswap Tokens balance is exhausted,please refill Timeswappers Withdraw Wallet.' });
          }
          store.txNonce += 1;
          store.esBalanceOfWithdrawlAccount = store.esBalanceOfWithdrawlAccount.sub(amountToSend);

          // data[i].transactionHash = tx.hash;
          console.log(tx.hash);
          
          // await data.save();
          await LiquidWithdraw.findByIdAndUpdate(request._id, { transactionHash: tx.hash });
        }
      }
      // await data.save();
    });
}

module.exports = {
  startProcessingWithdrawls
}