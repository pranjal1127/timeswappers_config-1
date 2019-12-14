const express = require('express');
const router = express.Router();

const configAdminCont = require('../controllers/config.admin.cont');

// router.get('/getPowerTokensExchangeRate', adminDashboardCont.getPowerTokensExchangeRate);
router.post('/power-token-lock', configAdminCont.setPowerTokenLock);
router.post('/set-gwei', configAdminCont.setGwei);
router.get('/', configAdminCont.getConfigurations);
router.post('/update-others', configAdminCont.updateConfigurations);
router.post('/transaction', configAdminCont.transaction);
router.get('/wallet-address', configAdminCont.getWalletAddressOfPrivateKey);


module.exports = router;