const { PostModel, AuthModel } = require("../models");

const getAllPost =async (req,res) => {

    try{

        const blogs =await PostModel.find().populate("userId","userName email");

        return res.status(200).json({
            message : "All data fetched successfully",
            data : blogs
        })

    }catch(err){

        console.log(err);
        return res.status(500).json({
            message : "Internal server error occured"
        });

    }
};

const createPost =async (req,res) => {

    try{

        const {title, body, tags} = req.body;
    
        const newBlog = new PostModel({
            userId : req.user._id,
            title,
            body,
            tags,
            comment : []
        });
    
        const blog = await newBlog.save();
    
        return res.status(200).json({
            message : "Post create succesfully",
            blogId : blog._id
        })

    }catch(err){

        console.log(err);
        return res.status(500).json({
            message : "Internal server error occured"
        });

    }
};

const getPost =async (req,res) => {

    try{
        const {id} = req.params;
        const blog = await PostModel.findById(id).populate("userId","userName email");
    
        if(!blog){
            return res.status(404).json({
                message : "No data available"
            })
        }
        return res.status(200).json({
            message : "Data fetched succesfuly",
            data : blog
        })

    }catch(err){

        console.log(err);
        return res.status(500).json({
            message : "Internal server error occured"
        })

    }
};

const updatePost =async (req,res) => {

    try{

        const {id} = req.params;
        const blog = await PostModel.findById(id).populate("userId");
    
        if(String(req.user._id) !== String(blog.userId._id)){
            return res.status(404).json({
                message : "Action is forbidden"
            })
        }

        const updatedBlog = await PostModel.findByIdAndUpdate(id,req.body,{
            returnDocument : "after"
        });
        
        return res.status(200).json({
            message : "post update succesful",
            data : updatedBlog
        })

    }catch(err){

        console.log(err);
        return res.status(500).json({
            message : "Internal server error occured"
        })

    }

};

const deletePost =async (req,res) => {
    try{

        const {id} = req.params;
        const blog = await PostModel.findById(id).populate("userId");

        if(!blog){
            return res.status(404).json({
                message : "Blog with given id  dosent exist"
            })
        }

        if(String(blog.userId._id) !== String(req.user._id)){
            return res.status(403).json({
                message : "Unauthorized action"
            })
        }

        await blog.deleteOne();

        return res.status(200).json({
            message : "Post deleted"
        })

    }catch(err){

        console.log(err);
        return res.status(500).json({
            message : "Internal server error occured"
        })

    }
};

const createComment = async (req,res) => {

    try{

        const {postId} = req.params;
        const blog = await PostModel.findById(postId);
        console.log(postId)

        if(!blog){
            return res.status(404).json({
                message : "Blog with given id not found"
            })
        }

        const newComment = req.body;
        newComment.userId = req.user._id;

        const updatedBlog = await PostModel.findByIdAndUpdate(postId,{
            $push : {
                comments : newComment
            }
        },{
            returnDocument : "after"
        });

        const createdComment = updatedBlog.comments[updatedBlog.comments.length - 1];

        return res.status(201).json({
            message : "comment created",
            createdComment
        })

    }catch(err){

        console.log(err);
        return res.status(500).json({
            message : "Internal server error occured"
        })

    }
};

const updateComment = async (req,res) => {

    try{

        const {postId, commentId} = req.params;
        
        const blog = await PostModel.findById(postId);

        if(!blog){
            return res.status(404).json({
                message : "Blog with given id not found"
            })
        }

        const comment =  blog.comments.id(commentId);

        if(String(comment.userId)!== String(req.user._id)){
            return res.status(403).json({
                message : "Action Unauthorized"
            })
        }

        comment.comment = req.body.comment;
        comment.updatedAt = new Date();
        await blog.save();
        const updatedComment = blog.comments.id(commentId);

        return res.status(200).json({
            message : "comment updated",
            updatedComment
        })

    }catch(err){

        console.log(err);
        return res.status(500).json({
            message : "Internal server error occured"
        })

    }
};

const deleteComment = async (req,res) => {

    try{

        const {postId, commentId} = req.params;

        const blog = await PostModel.findById(postId);

        if(!blog){
            return res.status(404).json({
                message : "Blog with given id not found"
            })
        }

        const comment =  blog.comments.id(commentId);
        if(!comment){
            return res.status(404).json({
                message : "Comment with given id not found"
            })
        }

        if(String(comment.userId)!== String(req.user._id)){
            return res.status(403).json({
                message : "Action Unauthorized"
            })
        };

        const updatedBlog = await PostModel.findOneAndUpdate({
            _id : postId
        },{
            $pull : {
                comments : {_id : commentId}
            }
        },{
            returnDocument : "after"
        })

        console.log(updatedBlog)

        return res.status(200).json({
            message : "Comment deleted"
        })

    }catch(err){

        console.log(err);
        return res.status(500).json({
            message : "Internal server error occured"
        })

    }
};

module.exports = {
    getAllPost,
    getPost,
    createPost,
    updatePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment
}