'use client';

import { Trip } from '@/lib/types';
import { format } from 'date-fns';
import Button from '../UI/Button';
import { Download, Upload, Save, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface TripHeaderProps {
  trip: Trip;
  onNameChange: (name: string) => void;
  onExport: () => void;
  onImport: () => void;
  onSave: () => void;
  shareLink?: string;
  isSupabaseEnabled?: boolean;
}

export default function TripHeader({
  trip,
  onNameChange,
  onExport,
  onImport,
  onSave,
  shareLink,
  isSupabaseEnabled = false,
}: TripHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-lg border border-blue-100/50 p-6 mb-6 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={trip.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="text-3xl font-bold text-gray-900 border-none outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl px-3 py-2 -ml-3 bg-transparent placeholder:text-gray-400 transition-all"
            placeholder="Trip Name"
          />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <p className="text-gray-600 font-medium">
              {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {isSupabaseEnabled && shareLink && (
            <Button 
              variant="primary" 
              onClick={handleShare} 
              className="flex items-center gap-2"
              title="Copy share link"
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? 'Copied!' : 'Share'}
            </Button>
          )}
          <Button variant="secondary" onClick={onSave} className="flex items-center gap-2">
            <Save size={16} />
            Save
          </Button>
          <Button variant="secondary" onClick={onExport} className="flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button variant="secondary" onClick={onImport} className="flex items-center gap-2">
            <Upload size={16} />
            Import
          </Button>
        </div>
      </div>

    </div>
  );
}

