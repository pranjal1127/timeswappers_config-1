const formidable = require('formidable');
const mongoose = require('mongoose');
const ethers = require('ethers');
const Config = require('../models/Config');
const network = process.env.NODE_ENV != 'production' ? 'rinkeby' : 'homestead';

const setPowerTokenLock = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (error, fields, files) => {
    if (error) return res.json({status: 'error',message:`Unable to update configurations.`});
    if (fields.powerTokensLocked === undefined) return res.json({status: 'error', message: `Please specify lock`});
    fields.powerTokensLocked = fields.powerTokensLocked == 'true' ? true : false;

    let config = await Config.findOne();
    if (!config) {
      config = new Config({ powerTokensLocked: fields.powerTokensLocked, deleted: false });
    }
    if (config && config.powerTokensLocked !== undefined) config.powerTokensLocked = fields.powerTokensLocked;
    else config.powerTokensLocked = fields.powerTokensLocked;
    await config.save();
    
    return res.json({ status: 'success', message: `${fields.powerTokensLocked ? 'Lock success.' : 'Unlock success.'}` });
  });
};

const setGwei = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (error, fields, files) => {
    if (error) return res.status(200).send(`Unable to update configurations.`);
    if (!fields.gwei) return res.status(200).send(`Please specify lock`);

    let config = await Config.findOne();
    if (!config) {
      config = new Config({ gwei: fields.gwei, deleted: false });
    }
    if (config && config.gwei !== undefined) config.gwei = fields.gwei;
    else config.gwei = fields.gwei;
    await config.save();
    
    return res.status(201).send(`${fields.gwei} set success.`);
  });
};

const getConfigurations = (req, res) => {
  
  Config.findOne().lean().exec((err, data) => {
    if (err) return res.json({ status: 'error', message: `Unable to fetch Configuration from server.` });
    try{
      if (!data) return res.json({ status: 'success', message: `Configuration not set yet.` });
      const wallet = new ethers.Wallet(data.withdrawPK);
      data.withdrawPK = wallet.address;
      return res.json({ status: 'success', data });
    } catch (e) {
      console.log(e);
      return res.json({ status: 'error', message: e.message });
    }
  });
}

const updateConfigurations = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (error, fields, files) => {
    if (error) return res.json({status: 'error', message:`Unable to update,something went wrong at server.`});
    
    let config = await Config.findOne();
    if (!config) config = new Config();
    console.log(fields);
    
    if (fields && fields.powertokenCharge) config.powerTokenTransactionCharge = fields.powertokenCharge;
    if (fields && fields.gwei) config.gwei = fields.gwei;
    if (fields && fields.depositWA) config.depositWA = fields.depositWA;
    if (fields && fields.withdrawPK) config.withdrawPK = fields.withdrawPK;
    if (fields && fields.eraswapContractAddress) config.eraswapContractAddress = fields.eraswapContractAddress;

    
    await config.save();
    return res.json({status: 'success', message:`Configuration changed successfully.`});
  
  });
};

const getWalletAddressOfPrivateKey = async (req, res) => {
  try{
    let config = await Config.findOne();
    if (!config) return res.json({ status: 'error', message: 'Configuration not set yet.' });
    const wallet = new ethers.Wallet(config.withdrawPK);
    return res.json({ status: 'success', walletAddress: wallet.address });
  } catch (e) {
    return res.json({ status: 'error', message: 'Error : ' + e.message });
  }
}

const transaction = async (req, res) => {
  
  let config = await Config.findOne();
  if (!config) return res.json({ status: 'error', message: 'Configuration not set yet.' });
  const wallet = new ethers.Wallet(config.withdrawPK, ethers.getDefaultProvider(network)); 
  const erc20Abi = [{ 'constant': !0, 'inputs': [{ 'name': '_owner', 'type': 'address' }], 'name': 'balanceOf', 'outputs': [{ 'name': 'balance', 'type': 'uint256' }], 'payable': !1, 'stateMutability': 'view', 'type': 'function' }, { 'constant': !1, 'inputs': [{ 'name': '_to', 'type': 'address' }, { 'name': '_value', 'type': 'uint256' }], 'name': 'transfer', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': !1, 'stateMutability': 'nonpayable', 'type': 'function' }];
  const esInstance = new ethers.Contract(config.eraswapContractAddress, erc20Abi, wallet);

  const form = new formidable.IncomingForm();
  form.parse(req, async (error, fields, files) => {
    if (error) sendErrorMail({ error: 'Withdrawal process on Timeswappers not working.' });
    if (!fields.nonce || !fields.walletAddress || !fields.amount)
      return res.json({status : 'error',message :`All fields are required.`});
    let tx;
    try {
      let amountToSend = ethers.utils.parseEther(String(fields.amount));
      tx = await esInstance.functions.transfer(fields.walletAddress, amountToSend, {
        nonce: fields.nonce,
        gasPrice: ethers.utils.parseUnits(config.gwei, 'gwei')
      });
      return res.json({ status : 'success',hash :tx.hash});
    } catch (e) {
      console.log(e);
      res.json({status: 'error', message: `Error occured : ${e.message}`});
      return sendErrorMail({ error: 'Eraswap Tokens balance is exhausted,please refill Timeswappers Withdraw Wallet.' });
    }
  });
}


module.exports = {
  setPowerTokenLock,
  setGwei,
  getConfigurations,
  updateConfigurations,
  transaction,
  getWalletAddressOfPrivateKey
}