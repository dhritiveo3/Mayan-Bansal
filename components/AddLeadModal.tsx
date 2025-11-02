import React, { useState, useEffect, useRef } from 'react';
import type { Lead } from '../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (leadData: Omit<Lead, 'id' | 'added' | 'status'>) => void;
}

const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export default function AddLeadModal({ isOpen, onClose, onAddLead }: AddLeadModalProps): React.ReactElement | null {
  const [leadInfo, setLeadInfo] = useState({ name: '', email: '', phone: '', value: ''});
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setLeadInfo({ name: '', email: '', phone: '', value: ''});
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadInfo.name.trim()) {
      onAddLead({
        name: leadInfo.name,
        email: leadInfo.email,
        phone: leadInfo.phone,
        value: Number(leadInfo.value) || 0,
      });
    }
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (modalRef.current && e.target === modalRef.current) {
          onClose();
      }
  }

  if (!isOpen) {
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setLeadInfo(prev => ({...prev, [id]: value}));
  }

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-lead-title"
    >
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-slide-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 id="add-lead-title" className="text-xl font-bold text-white">Add New Lead</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Lead Name</label>
              <input ref={inputRef} type="text" id="name" value={leadInfo.name} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Jane Doe" required />
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" id="email" value={leadInfo.email} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., jane.doe@example.com" />
            </div>
             <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input type="tel" id="phone" value={leadInfo.phone} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 123-456-7890" />
            </div>
             <div>
              <label htmlFor="value" className="block text-sm font-medium text-slate-300 mb-2">Deal Value ($)</label>
              <input type="number" id="value" value={leadInfo.value} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 5000" />
            </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!leadInfo.name.trim()}>Save Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}
