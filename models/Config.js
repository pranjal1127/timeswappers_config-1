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
        // default: 5
    },
    bankWithdrawalFee: {
        type: Number,
        // default: 2
    },
    EST_ETH: { type: Number },
    powerTokensLocked: {
        type : Boolean,
        default: false
    },
    powerTokenTransactionCharge: {
        type: Number,
        default : 0.25
    },
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
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Config', ConfigSchema);