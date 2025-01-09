import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import supabase from '../lib/db';

export class VectorStore {
  private static instance: VectorStore;
  private genAI: GenerativeModel;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.genAI = genAI.getGenerativeModel({ model: "embedding-001" });
  }

  static getInstance() {
    if (!VectorStore.instance) {
      VectorStore.instance = new VectorStore();
    }
    return VectorStore.instance;
  }

  async addDocument(content: string, metadata: any, source?: string) {
    try {
      const result = await this.genAI.embedContent(content);
      const embedding = result.embedding.values;

      return supabase
        .from('documents')
        .insert({
          content,
          source,
          metadata,
          embedding
        })
        .select()
        .single();

    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async search(query: string, limit: number) {
    const result = await this.genAI.embedContent(query);
    const embedding = result.embedding.values;
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: limit
    });
    if (error) {
      console.error('Search Error:', error.message);
      return [];
    }  
    return data;
  }

  async deleteDocument(endpoint: string) {
    try {
      const { error } = await supabase
      .from('documents')
      .delete()
      .filter('metadata->>endpoint', 'eq', endpoint); 
    
    if (error) {
      return false;
    }
    return true;
    } catch (error) {
      return false;
    }
  }

  async addDocuments(documents: Array<{ content: string; metadata: any; source?: string }>) {
    try {
      const embeddings = await Promise.all(
        documents.map(async (doc) => {
          const result = await this.genAI.embedContent(doc.content);
          return result.embedding.values;
        })
      );
  
      const documentsWithEmbeddings = documents.map((doc, index) => ({
        content: doc.content,
        metadata: doc.metadata,
        source: doc.source,
        embedding: embeddings[index],
      }));
  
      const { error } = await supabase
        .from('documents')
        .insert(documentsWithEmbeddings);
  
      if (error) {
        console.error('Error during batch insert:', error);
        throw error;
      }
  
      return { success: true };
    } catch (error) {
      console.error('Error adding documents:', error);
      throw error;
    }
  }
  
}
