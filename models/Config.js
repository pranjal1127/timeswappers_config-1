let mongoose = require('mongoose');

let ConfigSchema = new mongoose.Schema({
    mainAddress: {
        type: String
    },
    mainAddressPassword: {
        type: String
    },
    withdrawalFee: {
        type: Number,
        default: 0.25
    },
    bankWithdrawalFee: {
        type: Number,
        default: 0.25
    },
    EST_ETH: { type: Number },
    powerTokensLocked: {
        type : Boolean,
        default: false
    },
    // powerTokenTransactionCharge: {
    //     type: Number,
    //     default : 0.25
    // },
    gwei: {
        type: String,
        default : '20'
    },
    depositWA: {
        type: String,
    },
    withdrawPK: {
        type : String
    },
    eraswapContractAddress: {
        type : String
    },
    erscrowWalletAddress: {
        type: String,
        default : '0x641b63dabe00de60f401d2db5d1b22eedad915f2'
    },
    // bannerAdCharge: {
    //     type: Number,
    //     default : 3000
    // },
    // sidebarAdCharge: {
    //     type: Number,
    //     default : 2000
    // },
    // homepageAdCharge: {
    //     type: Number,
    //     default  : 1500
    // },
    // curatorCharge: {
    //     type: Number,
    //     default : 10000
    // },
    companyWalletAddress: {
        type: String,
        default :'companyWallet'
    },
    adsWalletAddress: {
        type: String,
        default : 'adsWallet'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Config', ConfigSchema);