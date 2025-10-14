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
