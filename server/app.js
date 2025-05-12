import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


import connecttoDatabase from './database/mongodb.js';
import { PORT } from './config/env.js';

//Routes
import authRouter from './routes/auth.route.js';
import postRouter from './routes/post.route.js';
import commentRoute from './routes/comment.route.js';
import userRoute from './routes/user.route.js';

const app = express();
connecttoDatabase();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{res.send("Api is working")});

app.use('/api/auth',authRouter);
app.use('/api/user', userRoute);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRoute);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});