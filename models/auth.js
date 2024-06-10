const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    token : {
        type : String,
        default : null
    }
});

const AuthModel = mongoose.model("auths",userSchema);

module.exports = AuthModel;