import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const corsOptions = {
   origin: [
    process.env.FRONTEND_URL, 
    'http://ly.naiblog.cn', 
    'http://localhost:5173',
     'https://ly.naiblog.cn', 
     'https://love.naiblog.cn',
     'http://love.naiblog.cn',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default cors(corsOptions);
