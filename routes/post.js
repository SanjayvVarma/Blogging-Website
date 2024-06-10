const express = require("express");
const { getAllPost, getPost, createPost, updatePost, deletePost, createComment, updateComment, deleteComment } = require("../controllers");
const {passport} = require("../middlewares");

const postRouter = express.Router();

postRouter.get("/posts/all",getAllPost);

postRouter.post("/posts/",passport.authenticate('jwt', { session: false }),createPost);

postRouter.get("/posts/:id",getPost);

postRouter.put("/posts/:id",passport.authenticate('jwt', { session: false }),updatePost);

postRouter.delete("/posts/:id",passport.authenticate('jwt', { session: false }),deletePost);

postRouter.post("/comments/:postId",passport.authenticate('jwt', { session: false }),createComment);

postRouter.put("/comments/:postId/:commentId",passport.authenticate('jwt', { session: false }),updateComment);

postRouter.delete("/comments/:postId/:commentId",passport.authenticate('jwt', { session: false }),deleteComment);

module.exports = postRouter;