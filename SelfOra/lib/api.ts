import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/accounts", // match Django URL
  headers: { "Content-Type": "application/json" },
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface LearningVideo {
  id: number;
  title: string;
  description: string;
  video_url: string;
  created_at: string;
}

export interface MotivationalQuote {
  id: number;
  quote_text: string;
  author: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Pages
export interface PageItem {
  id: number;
  title: string;
  content: string; // HTML for now
  icon?: string;
  is_favorite?: boolean;
  parent?: number | null;
  created_at: string;
  updated_at: string;
}

export async function listPages(): Promise<PageItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/pages/`, { headers: { ...getAuthHeaders() } });
    const data = await res.json();
    return data?.results || data || [];
  } catch (e) {
    console.error('listPages error', e);
    return [];
  }
}

export async function createPage(payload: Partial<PageItem> = {}): Promise<PageItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/pages/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ title: 'Untitled', content: '', ...payload }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('createPage error', e);
    return null;
  }
}

export async function getPage(id: number): Promise<PageItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/pages/${id}/`, { headers: { ...getAuthHeaders() } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('getPage error', e);
    return null;
  }
}

export async function updatePage(id: number, payload: Partial<PageItem>): Promise<PageItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/pages/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('updatePage error', e);
    return null;
  }
}

// Templates
export interface TemplateItem {
  id: number;
  title: string;
  description?: string;
  content: any;
  owner?: number | null;
  owner_username?: string;
  is_global: boolean;
  source_template?: number | null;
  category?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function listTemplates(): Promise<TemplateItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/`, { headers: { ...getAuthHeaders() } });
    const data = await res.json();
    return data?.results || data || [];
  } catch (e) {
    console.error('listTemplates error', e);
    return [];
  }
}

export async function createTemplate(payload: Partial<TemplateItem>): Promise<TemplateItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('createTemplate error', e);
    return null;
  }
}

export async function updateTemplate(id: number, payload: Partial<TemplateItem>): Promise<TemplateItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('updateTemplate error', e);
    return null;
  }
}

export async function deleteTemplate(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/${id}/`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return res.ok;
  } catch (e) {
    console.error('deleteTemplate error', e);
    return false;
  }
}

export async function useTemplate(id: number, overrides?: Partial<TemplateItem>): Promise<TemplateItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/${id}/use/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(overrides || {}),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('useTemplate error', e);
    return null;
  }
}

// Fetch learning videos
export async function fetchLearningVideos(): Promise<LearningVideo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-videos/`);
    const result: ApiResponse<LearningVideo[]> = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch videos:', result.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching learning videos:', error);
    return [];
  }
}

// Fetch motivational quotes
export async function fetchMotivationalQuotes(): Promise<MotivationalQuote[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/motivational-quotes/`);
    const result: ApiResponse<MotivationalQuote[]> = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch quotes:', result.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching motivational quotes:', error);
    return [];
  }
}

// Fetch random motivational quote
export async function fetchRandomQuote(): Promise<MotivationalQuote | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/random-quote/`);
    const result: ApiResponse<MotivationalQuote> = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch random quote:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching random quote:', error);
    return null;
  }
}

export default API;
