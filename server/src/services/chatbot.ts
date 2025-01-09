import axios from 'axios';
import { SYSTEM_PROMPT } from '../lib/prompt';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { isPotentialAPIRequest } from '../lib/util';
import { AI_CONFIG, JSON_PATTERNS } from '../lib/constant';
import { DocumentationService } from './documentationService';
 

class ChatBot {
  private docService: DocumentationService;

  constructor() {
    this.docService = DocumentationService.getInstance();
  }

  private initGeminiModel() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    return genAI.getGenerativeModel({ model: AI_CONFIG.MODEL_NAME });
  }

  public async generateGeminiResponse(
    message: string,
    history: { role: string; content: string }[]
  ) {
    const model = this.initGeminiModel();

    const data = await this.docService.getApiDocs();
    const apiDocs = data?.map(doc => doc.content).join('\n');
    const releventContext = await this.docService.searchDocs(message);

    const prompt = `
      ${SYSTEM_PROMPT}
    
      API Documentation:
      ${apiDocs}
    
      Relevant Context:
      ${releventContext}
    
      Conversation History:
      ${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
      User: ${message}
      Assistant:`;

    try {
      const result = await model.generateContent(prompt);
      let response = result.response.text();

      if (isPotentialAPIRequest(response)) {
        response = await this.validateAndFixAPI(response, message, 2);
      }

      return {
        response,
        history: [
          ...history,
          { role: 'user', content: message },
          { role: 'assistant', content: response },
        ],
      };
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }


  private async validateAndFixAPI(
    response: string,
    message: string,
    retries: number
  ): Promise<string> {
    let attempts = 0;

    while (attempts < retries) {
      try {
        let apiRequest;

        const jsonMatch = response.match(JSON_PATTERNS.API_REQUEST);
        if (jsonMatch) {
          apiRequest = JSON.parse(jsonMatch[0]);
        } else {
          const curlMatch = response.match(JSON_PATTERNS.CURL_COMMAND);
          if (curlMatch) {
            const [_, method, url] = curlMatch;

            const headers: { [key: string]: string } = {};
            const headerMatches = response.matchAll(JSON_PATTERNS.HEADER_MATCH_ALL);
            for (const match of headerMatches) {
              headers[match[1]] = match[2];
            }

            const bodyMatch = response.match(JSON_PATTERNS.BODY_MATCH);
            const body = bodyMatch ? JSON.parse(bodyMatch[1]) : undefined;

            apiRequest = {
              method,
              endpoint: url,
              headers,
              body
            };
          }
        }

        if (!apiRequest?.method || !apiRequest?.endpoint) {
          return response;
        }

        const axiosConfig: any = {
          method: apiRequest.method,
          url: apiRequest.endpoint,
          headers: apiRequest.headers || {},
          data: apiRequest.body || {},
        };

        const apiResponse = await axios(axiosConfig);

        if (apiResponse.status >= 200 && apiResponse.status < 300) {
          return JSON.stringify(apiResponse.data, null, 2);
        } else {
          console.error(`API Error (Attempt ${attempts + 1}):`, apiResponse);

          const fixPrompt = `The API call failed with status code ${apiResponse.status} and error: ${apiResponse.data}. Update the API request based on the error and retry.`;
          const newPrompt = `${SYSTEM_PROMPT}\n\n${fixPrompt}\n\nUser: ${message}\nAssistant:`;

          const model = this.initGeminiModel();
          const fixResult = await model.generateContent(newPrompt);
          response = fixResult.response.text();
        }
      } catch (error) {
        break;
      }

      attempts++;
    }

    return response;
  }
}

export default ChatBot;
