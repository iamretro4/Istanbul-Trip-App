'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import Button from '../UI/Button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  lastQueries?: string[];
}

export default function SearchBar({ onSearch, onClear, isLoading, lastQueries = [] }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Reddit, web, or browse suggestions..."
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white shadow-sm transition-all text-gray-700 placeholder:text-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onClear();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <Button type="submit" variant="primary" disabled={isLoading || !query.trim()} className="px-6">
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {lastQueries.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Recent:</span>
          {lastQueries.slice(0, 5).map((q, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(q);
                onSearch(q);
              }}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-all font-medium text-gray-600"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

