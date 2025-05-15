import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';

import connecttoDatabase from './database/mongodb.js';
import { PORT } from './config/env.js';

//Routes
import authRouter from './routes/auth.route.js';
import postRouter from './routes/post.route.js';
import commentRoute from './routes/comment.route.js';
import userRoute from './routes/user.route.js';

const app = express();
connecttoDatabase();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://swagatomworld.onrender.com',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Swagatom</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          position: relative;
          background: #000;
          overflow: hidden;
          color: #fff;
        }

        .gradient-overlay {
          position: absolute;
          top: -150px;
          left: -25%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle at center, rgba(255, 165, 0, 0.6), rgba(255, 215, 0, 0.4), transparent 70%);
          filter: blur(120px);
          z-index: 0;
        }

        .container {
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(255, 165, 0, 0.3);
          z-index: 1;
          position: relative;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #ffcc00;
        }

        p {
          font-size: 1.2rem;
          margin-top: 0;
          color: #ffa500;
        }

        .icon {
          font-size: 3rem;
          margin-bottom: 10px;
          color: #ffcc00;
        }
      </style>
    </head>
    <body>
      <div class="gradient-overlay"></div>
      <div class="container">
        <div class="icon">🔥</div>
        <h1>Welcome to Swagatom</h1>
        <p>Empowering learning through events, activities, and travel experiences.</p>
        <p>The backend is running successfully.</p>
      </div>
    </body>
    </html>
  `);
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRoute);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRoute);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://swagatomworld.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Attach io instance to app locals so you can access it in controllers
app.locals.io = io;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
