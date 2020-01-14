const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    narration: {
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true,
        min:1
    },
    type: {
        type:String,
        required: true,
    },
    story : {
        type:String
    },
    date_added:{
        type: Date,
        default: Date.now()
    },
    transaction_date: {
        type: Number,
    }
})

module.exports = mongoose.model('transaction', transactionSchema);