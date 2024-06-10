const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : "users"
    },
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    tags : {
        type : Array,
        required : true
    },
    comments : [
        {
            comment : {
                type : String,
                required : true
            },
            userId : {
                type : mongoose.Types.ObjectId,
                required : true,
                ref : "users"
            },
            createdAt  : {
                type : Date,
                default : new Date()
            },
            updatedAt : {
                type : Date,
                default : new Date()
            }
        }
    ]
},
{
    timestamps : true
});

const PostModel = mongoose.model("posts",blogSchema);

module.exports = PostModel;