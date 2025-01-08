import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import { handleChat, initChatbot } from "./controllers/chat";
const PORT = process.env.PORT || 4000;

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', process.env.ISITON_URL || ''],
  credentials: true
}));

app.post("/api/chat", handleChat);

initChatbot();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 