import type { Lead, Activity } from './types';

export const initialLeads: Lead[] = [
  { id: 1, name: 'Mayan Bansal', email: 'mayan.bansal@example.com', phone: '123-456-7890', value: 5000, status: 'Unattended', added: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: 2, name: 'Jane Doe', email: 'jane.d@example.com', phone: '234-567-8901', value: 7500, status: 'New', added: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: 3, name: 'John Smith', email: 'j.smith@example.com', phone: '345-678-9012', value: 3000, status: 'Hot', added: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  { id: 4, name: 'Emily White', email: 'emily.w@example.com', phone: '456-789-0123', value: 12000, status: 'Follow-up', added: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
  { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', phone: '567-890-1234', value: 8500, status: 'Converted', added: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
  { id: 6, name: 'Sarah Green', email: 'sarah.g@example.com', phone: '678-901-2345', value: 4200, status: 'Unattended', added: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: 7, name: 'David Black', email: 'david.b@example.com', phone: '789-012-3456', value: 6800, status: 'Unattended', added: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
];

export const initialActivity: Activity[] = [
  { id: 1, type: 'New Lead', description: 'New lead added: Mayan Bansal', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), user: 'System' },
  { id: 2, type: 'Follow-up', description: 'Follow-up scheduled for "Jane Doe"', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), user: 'Mayan' },
  { id: 3, type: 'Lead Updated', description: 'Lead status changed for "John Smith" to Hot', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), user: 'AI Assistant' },
  { id: 4, type: 'New Lead', description: 'New lead added: Emily White', timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), user: 'System' },
];
