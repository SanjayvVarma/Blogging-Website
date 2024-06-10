const { getAllPost, getPost, createPost, updatePost, deletePost, createComment, updateComment, deleteComment } = require("./post");
const { signUp, logIn, logOut } = require("./auth");


module.exports = {
    signUp,
    logIn,
    logOut,
    getAllPost,
    getPost,
    createPost,
    updatePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment
};