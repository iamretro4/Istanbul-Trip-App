import { Suggestion, ActivityCategory } from './types';
import { getCachedSuggestions, cacheSuggestions } from './storage';

const SUBREDDITS = ['istanbul']; // Focus only on Istanbul subreddit
const MAX_RESULTS = 30;

export async function searchReddit(query: string): Promise<Suggestion[]> {
  // Check cache first
  const cached = getCachedSuggestions(`reddit:${query}`);
  if (cached) {
    return cached;
  }

  const suggestions: Suggestion[] = [];

  try {
    // Search Istanbul subreddit with better query handling
    const searchUrl = query.trim() 
      ? `https://www.reddit.com/r/istanbul/search.json?q=${encodeURIComponent(query)}&limit=25&sort=relevance&t=all`
      : `https://www.reddit.com/r/istanbul/hot.json?limit=25`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.data && data.data.children) {
      const posts = data.data.children.map((child: any) => {
        const post = child.data;
        const neighborhood = extractNeighborhood(post.title, post.selftext);
        
        return {
          id: `reddit-${post.id}`,
          title: post.title,
          description: (post.selftext || post.title).substring(0, 500),
          category: categorizeRedditPost(post.title, post.selftext),
          neighborhood: neighborhood || undefined,
          source: 'reddit' as const,
          sourceUrl: `https://reddit.com${post.permalink}`,
          upvotes: post.ups || 0,
          comments: post.num_comments || 0,
          tags: extractTags(post.title, post.selftext),
        };
      });

      // Sort by upvotes and relevance
      const sortedPosts = posts
        .sort((a: Suggestion, b: Suggestion) => {
          // Prioritize posts with more upvotes and comments
          const scoreA = (a.upvotes || 0) * 2 + (a.comments || 0);
          const scoreB = (b.upvotes || 0) * 2 + (b.comments || 0);
          return scoreB - scoreA;
        })
        .slice(0, MAX_RESULTS);

      suggestions.push(...sortedPosts);
    }

    // Also fetch from the pinned Q&A thread if query is empty or general
    if (!query.trim() || query.toLowerCase().includes('recommend') || query.toLowerCase().includes('suggest')) {
      try {
        const qaResponse = await fetch('https://www.reddit.com/r/istanbul/comments/1oldiw4/visiting_istanbul_have_a_quick_question_ask_here.json');
        const qaData = await qaResponse.json();
        
        if (qaData[0]?.data?.children?.[0]?.data) {
          const mainPost = qaData[0].data.children[0].data;
          // Extract top comments
          if (qaData[1]?.data?.children) {
            qaData[1].data.children.slice(0, 10).forEach((child: any) => {
              const comment = child.data;
              if (comment.body && comment.body.length > 50 && comment.ups > 5) {
                const neighborhood = extractNeighborhood('', comment.body);
                suggestions.push({
                  id: `reddit-comment-${comment.id}`,
                  title: `From Q&A Thread: ${comment.body.substring(0, 60)}...`,
                  description: comment.body.substring(0, 500),
                  category: categorizeRedditPost('', comment.body),
                  neighborhood: neighborhood || undefined,
                  source: 'reddit' as const,
                  sourceUrl: `https://reddit.com${mainPost.permalink}#${comment.id}`,
                  upvotes: comment.ups || 0,
                  comments: 0,
                  tags: extractTags('', comment.body),
                });
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching Q&A thread:', error);
      }
    }

    // Cache the results
    cacheSuggestions(`reddit:${query}`, suggestions);
  } catch (error) {
    console.error('Error searching Reddit:', error);
  }

  return suggestions;
}

function extractNeighborhood(title: string, text: string): string | null {
  const content = (title + ' ' + text).toLowerCase();
  const neighborhoods: Record<string, string> = {
    'kadikoy': 'Kadıköy',
    'moda': 'Moda',
    'balat': 'Balat',
    'sultanahmet': 'Sultanahmet',
    'galata': 'Galata',
    'beyoglu': 'Beyoglu',
    'cihangir': 'Cihangir',
    'nisantasi': 'Nisantasi',
    'eminonu': 'Eminonu',
    'ortakoy': 'Ortakoy',
    'bebek': 'Bebek',
    'tarabya': 'Tarabya',
    'uskudar': 'Üsküdar',
    'kuzguncuk': 'Kuzguncuk',
    'besiktas': 'Beşiktaş',
    'fatih': 'Fatih',
  };
  
  for (const [key, value] of Object.entries(neighborhoods)) {
    if (content.includes(key)) {
      return value;
    }
  }
  
  return null;
}

function categorizeRedditPost(title: string, text: string): ActivityCategory {
  const content = (title + ' ' + text).toLowerCase();
  
  if (content.match(/\b(food|restaurant|eat|dining|kebab|doner|breakfast|dinner|lunch|cafe|coffee|tea)\b/)) {
    return 'food';
  }
  if (content.match(/\b(nightlife|bar|club|drink|party|night)\b/)) {
    return 'nightlife';
  }
  if (content.match(/\b(museum|gallery|art|exhibition|history)\b/)) {
    return 'museum';
  }
  if (content.match(/\b(bazaar|market|shopping|shop|mall)\b/)) {
    return 'shopping';
  }
  if (content.match(/\b(mosque|palace|landmark|attraction|sightseeing|tourist)\b/)) {
    return 'landmark';
  }
  
  return 'sightseeing';
}

function extractTags(title: string, text: string): string[] {
  const content = (title + ' ' + text).toLowerCase();
  const tags: string[] = [];
  
  const neighborhoods = ['kadikoy', 'moda', 'balat', 'sultanahmet', 'galata', 'beyoglu', 'cihangir', 'nisantasi', 'eminonu', 'ortakoy', 'bebek', 'tarabya'];
  neighborhoods.forEach(neighborhood => {
    if (content.includes(neighborhood)) {
      tags.push(neighborhood);
    }
  });

  return tags;
}

