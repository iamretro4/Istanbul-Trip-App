'use client';

import { useState, useEffect } from 'react';
import { Suggestion, ActivityCategory } from '@/lib/types';
import { searchReddit } from '@/lib/reddit';
import { searchWeb } from '@/lib/search';
import { ISTANBUL_SUGGESTIONS } from '@/lib/istanbul-data';
import { getLastSearchQueries, addSearchQuery } from '@/lib/storage';
import SuggestionCard from './SuggestionCard';
import SearchBar from './SearchBar';
import Button from '../UI/Button';
import { Filter, X } from 'lucide-react';

interface SuggestionPanelProps {
  onAddSuggestion: (suggestion: Suggestion) => void;
}

const categories: { value: ActivityCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'food', label: 'Food' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'bazaar', label: 'Bazaar' },
  { value: 'landmark', label: 'Landmark' },
  { value: 'museum', label: 'Museum' },
];

const neighborhoods = [
  'All',
  'Sultanahmet',
  'Galata',
  'Eminonu',
  'Beyoglu',
  'Cihangir',
  'Kadikoy',
  'Moda',
  'Nisantasi',
  'Ortakoy',
  'Bebek',
  'Tarabya',
];

export default function SuggestionPanel({ onAddSuggestion }: SuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [lastQueries, setLastQueries] = useState<string[]>([]);

  useEffect(() => {
    // Load pre-populated Istanbul suggestions
    setSuggestions(ISTANBUL_SUGGESTIONS);
    setLastQueries(getLastSearchQueries());
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    addSearchQuery(query);
    setLastQueries(getLastSearchQueries());

    try {
      const [redditResults, webResults] = await Promise.all([
        searchReddit(query),
        searchWeb(query),
      ]);

      const combined = [...redditResults, ...webResults];
      setSuggestions(combined);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSuggestions(ISTANBUL_SUGGESTIONS);
    setSelectedCategory('all');
    setSelectedNeighborhood('All');
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (selectedCategory !== 'all' && suggestion.category !== selectedCategory) {
      return false;
    }
    if (selectedNeighborhood !== 'All' && suggestion.neighborhood !== selectedNeighborhood) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 h-full overflow-y-auto text-gray-900">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Suggestions</h2>
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Filters
        </Button>
      </div>

      <SearchBar
        onSearch={handleSearch}
        onClear={handleClear}
        isLoading={isLoading}
        lastQueries={lastQueries}
      />

      {showFilters && (
        <div className="mb-5 p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ActivityCategory | 'all')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white text-gray-700 transition-all"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Neighborhood</label>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 bg-white text-gray-700 transition-all"
            >
              {neighborhoods.map(neighborhood => (
                <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-gray-600 font-medium mb-2">No suggestions found</p>
            <p className="text-sm text-gray-500">Try a different search or filter</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAdd={onAddSuggestion}
            />
          ))
        )}
      </div>
    </div>
  );
}

