import { Request, Response } from 'express';
import { VectorStore } from '../services/vectorStore';
import { WebClient } from '@slack/web-api';
import { DocumentationService } from '../services/documentationService';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const vectorStore = VectorStore.getInstance();

interface DocumentRequest {
  content: string;
  source?: string;
  metadata: {
    type: 'qa' | 'slack' | 'api-docs';
    [key: string]: any;
  }
}

interface ApiDocRequest {
  endpoint: string;
  method: string;
  name: string;
  content: string;
  description: string;  
}

export const updateApiDoc = async (req: Request, res: Response): Promise<void> => {
  try {
    const { endpoint, name, content, description, method} = req.body as ApiDocRequest;
    const docService = DocumentationService.getInstance();

    const metadata = {
      type: 'api-docs',
      endpoint,
      name,
      description,
      method
    };

    const result = await docService.updateApiDoc(endpoint, name, content, metadata);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const addDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, metadata, source } = req.body as DocumentRequest;
    if(!content || !metadata) {
      res.status(400).json({ success: false, error: 'Content and metadata are required' });
      return;
    }
    const { data, error } = await vectorStore.addDocument(content, metadata, source);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};


export const searchDocs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    const docService = DocumentationService.getInstance();
    const results = await docService.searchDocs(query);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const importSlackMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channel } = req.body;

    if (!channel) {
      res.status(400).json({ success: false, error: 'Channel Id is required' });
      return;
    }

    const data = await slack.conversations.history({ channel });

    if (!data.ok || !data.messages) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch messages from Slack.',
      });
      return;
    }

    const messages = data.messages;

    if (messages.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No messages to import.',
        messagesProcessed: 0,
      });
      return;
    }

    const metadata = {
      type: 'slack',
      channel,
      timestamp: Date.now(),
    };

    const documents = messages.map((msg: any) => ({
      content: msg.text || '',
      metadata: {
        ...metadata,
        user: msg.user || null,
        subtype: msg.subtype || null,
        ts: msg.ts || null,
      },
      source: 'slack',
    }));

    const { success } = await vectorStore.addDocuments(documents);

    if (!success) {
      res.status(500).json({
        success: false,
        error: 'Failed to add documents',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Messages imported successfully',
      messagesProcessed: messages.length,
    });
  } catch (error: any) {
    if (error.data?.error === 'channel_not_found') {
      res.status(422).json({
        success: false,
        error: 'Channel not found',
      });
      return;
    }
    if(error.data?.error === 'not_in_channel') {
      res.status(409).json({
        success: false,
        error: 'The bot is not part of the channel',
      });
      return;
    }
    console.error('Error importing Slack messages:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred.',
    });
    return;
  }
};


 