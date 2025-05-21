// src/api.ts
import fetch from 'node-fetch';

export interface ConfluenceConfig {
  baseUrl: string;
  token: string;  // This can be a Basic Auth token or a Personal Access Token
  username?: string; // Optional for Basic Auth approach
  password?: string; // Optional for Basic Auth approach
}

export class ConfluenceClient {
  private baseUrl: string;
  private token: string;
  private username?: string;
  private password?: string;
  private useBasicAuth: boolean;

  constructor(config: ConfluenceConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.token = config.token;
    this.username = config.username;
    this.password = config.password;
    this.useBasicAuth = !!(this.username && this.password);
  }

  private getHeaders() {
    if (this.useBasicAuth) {
      const basicAuth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      return {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    } else {
      return {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }
  }

  async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders();
    
    const options: any = {
      method,
      headers,
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Confluence API Error (${response.status}): ${errorText}`);
      }
      
      if (response.status === 204) {
        return {} as T; // No content
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Pages API
  async getPage(id: string) {
    return this.request<any>('GET', `/rest/api/content/${id}?expand=body.storage,version,space,ancestors,metadata`);
  }

  async getPageChildren(id: string, limit: number = 25, start: number = 0) {
    return this.request<any>('GET', `/rest/api/content/${id}/child/page?limit=${limit}&start=${start}&expand=version`);
  }

  async getPages(spaceKey: string, limit: number = 25, start: number = 0) {
    return this.request<any>('GET', `/rest/api/content?spaceKey=${spaceKey}&type=page&limit=${limit}&start=${start}&expand=version`);
  }

  async createPage(data: any) {
    return this.request<any>('POST', '/rest/api/content', data);
  }

  async updatePage(id: string, data: any) {
    return this.request<any>('PUT', `/rest/api/content/${id}`, data);
  }

  async deletePage(id: string) {
    return this.request<any>('DELETE', `/rest/api/content/${id}`);
  }

  // Spaces API
  async getSpace(key: string) {
    return this.request<any>('GET', `/rest/api/space/${key}?expand=description.plain,homepage`);
  }

  async getSpaces(limit: number = 25, start: number = 0) {
    return this.request<any>('GET', `/rest/api/space?limit=${limit}&start=${start}&expand=description.plain`);
  }

  // Content API
  async getContent(id: string, expand: string[] = []) {
    const expandParam = expand.length > 0 ? `&expand=${expand.join(',')}` : '';
    return this.request<any>('GET', `/rest/api/content/${id}?${expandParam}`);
  }

  async getContentByType(spaceKey: string, type: string = 'page', limit: number = 25, start: number = 0) {
    return this.request<any>('GET', `/rest/api/content?spaceKey=${spaceKey}&type=${type}&limit=${limit}&start=${start}`);
  }

  // Attachments API
  async getAttachments(contentId: string, limit: number = 25, start: number = 0) {
    return this.request<any>('GET', `/rest/api/content/${contentId}/child/attachment?limit=${limit}&start=${start}`);
  }

  // Search API
  async search(cql: string, limit: number = 25, start: number = 0) {
    return this.request<any>('GET', `/rest/api/search?cql=${encodeURIComponent(cql)}&limit=${limit}&start=${start}`);
  }

  // Labels API
  async getLabels(contentId: string) {
    return this.request<any>('GET', `/rest/api/content/${contentId}/label`);
  }

  // Comments API
  async getComments(contentId: string, limit: number = 25, start: number = 0) {
    return this.request<any>('GET', `/rest/api/content/${contentId}/child/comment?limit=${limit}&start=${start}&expand=body.storage`);
  }

  // User API
  async getCurrentUser() {
    return this.request<any>('GET', `/rest/api/user/current`);
  }

  async getUserByUsername(username: string) {
    return this.request<any>('GET', `/rest/api/user?username=${username}`);
  }
}