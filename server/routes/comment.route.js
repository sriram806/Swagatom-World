import express from "express";
import userAuth from "../middleware/userAuth.js";
import { createComment, deleteComment, editComment, getcomments, getPostComments, likeComment } from "../controllers/comment.controller.js";

const commentRoute = express.Router();

commentRoute.post('/create', userAuth, createComment);
commentRoute.get('/getPostComments/:postId', getPostComments);
commentRoute.put('/likeComment/:commentId', userAuth, likeComment);
commentRoute.put('/editComment/:commentId', userAuth, editComment);
commentRoute.delete('/deleteComment/:commentId', userAuth, deleteComment);
commentRoute.get('/getcomments', userAuth, getcomments);

export default commentRoute;