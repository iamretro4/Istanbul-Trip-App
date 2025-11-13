import { Suggestion, ActivityCategory } from './types';
import { getCachedSuggestions, cacheSuggestions } from './storage';

export async function searchWeb(query: string): Promise<Suggestion[]> {
  // Check cache first
  const cached = getCachedSuggestions(`web:${query}`);
  if (cached) {
    return cached;
  }

  const suggestions: Suggestion[] = [];

  try {
    // Use DuckDuckGo Instant Answer API (no API key needed)
    const searchQuery = `Istanbul ${query} 2025`;
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`
    );

    if (response.ok) {
      const data = await response.json();
      
      // Process abstract results
      if (data.AbstractText) {
        suggestions.push({
          id: `web-abstract-${Date.now()}`,
          title: data.Heading || query,
          description: data.AbstractText,
          category: categorizeWebContent(data.AbstractText),
          source: 'web',
          sourceUrl: data.AbstractURL,
          tags: extractWebTags(data.AbstractText),
        });
      }

      // Process related topics
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.slice(0, 10).forEach((topic: any, index: number) => {
          if (topic.Text) {
            suggestions.push({
              id: `web-topic-${Date.now()}-${index}`,
              title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 50),
              description: topic.Text,
              category: categorizeWebContent(topic.Text),
              source: 'web',
              sourceUrl: topic.FirstURL,
              tags: extractWebTags(topic.Text),
            });
          }
        });
      }
    }

    // Fallback: Create suggestions based on common Istanbul queries
    if (suggestions.length === 0) {
      suggestions.push(...generateFallbackSuggestions(query));
    }

    // Cache the results
    cacheSuggestions(`web:${query}`, suggestions);
  } catch (error) {
    console.error('Error searching web:', error);
    // Return fallback suggestions on error
    return generateFallbackSuggestions(query);
  }

  return suggestions;
}

function categorizeWebContent(text: string): ActivityCategory {
  const content = text.toLowerCase();
  
  if (content.match(/\b(food|restaurant|eat|dining|kebab|doner|breakfast|dinner|lunch|cafe|coffee|tea|baklava|simit)\b/)) {
    return 'food';
  }
  if (content.match(/\b(nightlife|bar|club|drink|party|night)\b/)) {
    return 'nightlife';
  }
  if (content.match(/\b(museum|gallery|art|exhibition|history|modern)\b/)) {
    return 'museum';
  }
  if (content.match(/\b(bazaar|market|shopping|shop|mall|grand bazaar|spice bazaar)\b/)) {
    return 'bazaar';
  }
  if (content.match(/\b(mosque|palace|landmark|attraction|sightseeing|hagia sophia|topkapi|blue mosque)\b/)) {
    return 'landmark';
  }
  
  return 'sightseeing';
}

function extractWebTags(text: string): string[] {
  const content = text.toLowerCase();
  const tags: string[] = [];
  
  const neighborhoods = ['kadikoy', 'moda', 'balat', 'sultanahmet', 'galata', 'beyoglu', 'cihangir', 'nisantasi', 'eminonu', 'ortakoy', 'bebek', 'tarabya', 'asian side'];
  neighborhoods.forEach(neighborhood => {
    if (content.includes(neighborhood)) {
      tags.push(neighborhood);
    }
  });

  return tags;
}

function generateFallbackSuggestions(query: string): Suggestion[] {
  // Generate basic suggestions based on query keywords
  const queryLower = query.toLowerCase();
  const suggestions: Suggestion[] = [];

  if (queryLower.includes('food') || queryLower.includes('restaurant') || queryLower.includes('eat')) {
    suggestions.push({
      id: `fallback-food-${Date.now()}`,
      title: 'Local Turkish Cuisine',
      description: 'Explore authentic Turkish restaurants and street food in Istanbul',
      category: 'food',
      source: 'web',
      tags: ['food', 'restaurant'],
    });
  }

  if (queryLower.includes('bazaar') || queryLower.includes('market')) {
    suggestions.push({
      id: `fallback-bazaar-${Date.now()}`,
      title: 'Grand Bazaar & Spice Bazaar',
      description: 'Visit the historic markets for shopping and local products',
      category: 'bazaar',
      source: 'web',
      tags: ['bazaar', 'shopping'],
    });
  }

  if (queryLower.includes('nightlife') || queryLower.includes('bar')) {
    suggestions.push({
      id: `fallback-nightlife-${Date.now()}`,
      title: 'Istanbul Nightlife',
      description: 'Experience bars and nightlife in Beyoglu and Kadikoy',
      category: 'nightlife',
      source: 'web',
      tags: ['nightlife', 'bar'],
    });
  }

  return suggestions;
}

