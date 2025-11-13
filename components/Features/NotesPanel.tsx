'use client';

import { FileText } from 'lucide-react';

interface NotesPanelProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  label?: string;
}

export default function NotesPanel({ notes, onNotesChange, label = 'Notes' }: NotesPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
        <FileText size={22} className="text-blue-600" />
        {label}
      </h3>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add your notes, reminders, or tips here..."
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 min-h-[150px] text-gray-700 placeholder:text-gray-400 transition-all"
      />
    </div>
  );
}

