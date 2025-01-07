export const API_PATTERNS = {
  CURL_METHOD: /curl[\s\S]*-X\s+(GET|POST|PUT|DELETE|PATCH)/i,
  URL: /https?:\/\/[^\s'"]+/i,
  HEADERS: /-H\s+['"][^'"]+['"]/i,
  REQUEST_BODY: /-d\s+['"][\s\S]*?['"]/i,
  JSON_API: /{[\s\S]*"method":\s*"(GET|POST|PUT|DELETE|PATCH)"[\s\S]*"endpoint":\s*"[^"]+"/i,
};

export const JSON_PATTERNS = {
  API_REQUEST: /{[\s\S]*"method"[\s\S]*"endpoint"[\s\S]*}/,
  CURL_COMMAND: /curl\s+-X\s+(GET|POST|PUT|DELETE|PATCH)\s+['"]?(https?:\/\/[^\s'"]+)['"]?/i,
  HEADER_MATCH_ALL: /-H\s+[']([^:]+):\s*([^'"]+)['"]/g,  
  BODY_MATCH: /-d\s+['"]({[\s\S]*?})['"]/, 
};
 
export const AI_CONFIG = {
  MODEL_NAME: 'gemini-1.5-flash',
  MAX_API_RETRIES: 2,
};