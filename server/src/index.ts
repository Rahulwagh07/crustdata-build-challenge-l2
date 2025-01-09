import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import { handleChat, initChatbot } from "./controllers/chat";
import * as knowledge from "./controllers/knowledge";
import { initializeDatabase } from "./lib/util";
const PORT = process.env.PORT || 4000;

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', process.env.ISITON_URL || ''],
  credentials: true
}));

app.post("/api/chat", handleChat);
app.post("/api/update-api-doc", knowledge.updateApiDoc);
app.post("/api/knowledge/add", knowledge.addDocument);
app.get("/api/knowledge/search", knowledge.searchDocs);
app.post("/api/knowledge/slack", knowledge.importSlackMessages);

initChatbot();
initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 