const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        min:6
    },
    date_joined : {
        type: Date,
        default: Date.now
    },
    transactions :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'transaction'
        }
    ]
});


module.exports = mongoose.model('user', UserSchema)