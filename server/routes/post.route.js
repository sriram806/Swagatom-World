import express, { Router } from 'express';
import { createPost, deletePost, getposts, updatePost } from '../controllers/post.controller.js';
import userAuth from '../middleware/userAuth.js';

const postRouter = express.Router();

postRouter.post('/create' ,userAuth, createPost);
postRouter.get('/getposts', getposts);
postRouter.delete('/deletepost/:postId/:userId', userAuth, deletePost);
postRouter.put('/updatepost/:postId/:userId', userAuth, updatePost);


export default postRouter;