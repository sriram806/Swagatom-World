import express from "express";
import userAuth from "../middleware/userAuth.js";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.put('/update/:userId', userAuth, updateUser);
userRoute.delete('/delete/:userId', userAuth, deleteUser);
userRoute.get('/getusers', userAuth, getUsers);
userRoute.get('/:userId', userAuth, getUser);

export default userRoute;