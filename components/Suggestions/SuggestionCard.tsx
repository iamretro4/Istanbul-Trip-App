'use client';

import { Suggestion } from '@/lib/types';
import { MapPin, ExternalLink, ThumbsUp, MessageCircle, Plus } from 'lucide-react';
import Button from '../UI/Button';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onAdd: (suggestion: Suggestion) => void;
}

export default function SuggestionCard({ suggestion, onAdd }: SuggestionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 p-5 mb-4 transition-all duration-200 hover:scale-[1.01] hover:border-blue-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2 text-gray-900">{suggestion.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{suggestion.description}</p>
          
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
            {suggestion.neighborhood && (
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{suggestion.neighborhood}</span>
              </div>
            )}
            {suggestion.upvotes !== undefined && (
              <div className="flex items-center gap-1">
                <ThumbsUp size={12} />
                <span>{suggestion.upvotes}</span>
              </div>
            )}
            {suggestion.comments !== undefined && (
              <div className="flex items-center gap-1">
                <MessageCircle size={12} />
                <span>{suggestion.comments}</span>
              </div>
            )}
            {suggestion.source && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                {suggestion.source}
              </span>
            )}
          </div>

          {suggestion.tags && suggestion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestion.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <Button
          variant="primary"
          onClick={() => onAdd(suggestion)}
          className="flex items-center gap-2 flex-1"
        >
          <Plus size={18} />
          Add to Itinerary
        </Button>
        {suggestion.sourceUrl && (
          <Button
            variant="ghost"
            onClick={() => window.open(suggestion.sourceUrl, '_blank')}
            className="p-2"
          >
            <ExternalLink size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}

