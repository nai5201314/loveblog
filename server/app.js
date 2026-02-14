import express from 'express';
import dotenv from 'dotenv';
import cors from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '服务器运行正常',
    timestamp: new Date().toISOString()
  });
});
app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`服务器启动成功！`);
});

export default app;
