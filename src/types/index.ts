export interface Bill {
  id: string;
  title: string;
  publication_date: string;
  pdf_url: string;
}

export interface ChatMessage {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: string;
}

export interface ApiRequest {
  bill_id: string;
  query: string;
}

export interface ApiResponse {
  response: string;
} 