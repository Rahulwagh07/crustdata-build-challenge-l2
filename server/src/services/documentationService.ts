import { VectorStore } from './vectorStore';
import supabase from '../lib/db';

export class DocumentationService {
  private static instance: DocumentationService;
  private vectorStore: VectorStore;

  constructor() {
    this.vectorStore = VectorStore.getInstance();
  }

  static getInstance() {
    if (!DocumentationService.instance) {
      DocumentationService.instance = new DocumentationService();
    }
    return DocumentationService.instance;
  }

  async updateApiDoc(endpoint: string, name: string, content: string, metadata: any) {
    try {
  
      await this.vectorStore.deleteDocument(endpoint);
  
      const { data, error } = await this.vectorStore.addDocument(content, metadata);

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Error in updateApiDoc:', error);
      throw new Error(`Failed to update API doc: ${error}`);
    }
  }
 
  async addDocument(content: string, metadata: any) {
    try {
      return this.vectorStore.addDocument(content, metadata);
    } catch (error) {
      throw new Error(`Failed to add document: ${error}`);
    }
  }
 
  async searchDocs(query: string) {
    const { data: results } = await this.vectorStore.search(query, 3);
    return results || [];
  }
 
  async getApiDocs() {
    try {
      const { data, error } = await supabase
      .from('documents')
      .select('metadata, content')
      .filter('metadata->>type', 'eq', 'api-docs');
    
      if (error){
        console.log('Error fetching api docs:', error);
        return [];
      }
      return data;

    } catch (error) {
      console.log('Error in getApiDoc:', error);
      return [];
    }
  }
}
