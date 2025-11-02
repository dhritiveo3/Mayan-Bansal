export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  value: number;
  status: 'New' | 'Hot' | 'Follow-up' | 'Converted' | 'Unattended';
  added: Date;
}

export interface Activity {
  id: number;
  type: 'New Lead' | 'Lead Updated' | 'Follow-up';
  description: string;
  timestamp: Date;
  user: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  image?: string; // base64 image data
}
