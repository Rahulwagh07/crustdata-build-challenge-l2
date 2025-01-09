import { Request, Response } from 'express';
import ChatBot from '../services/chatbot';

let chatbot: ChatBot | null = null;

export const initChatbot = () => {
  try {
    chatbot = new ChatBot();
  } catch (error) {
    console.log(`Failed to initialize ChatBot: ${error}`);
    throw error;
  }
};

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!chatbot) {
      res.status(500).json({ error: 'Chatbot not initialized' });
      return;
    }
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    const result = await chatbot.generateGeminiResponse(message, history || []);
    res.json(result);
    return;
  } catch (error) {
    console.log(`Error in chat endpoint:`, error);
    res.status(500).json({
      message: 'internal server error'
    });
  }
};