import { Topic, TopicsResponse } from '@/types';
import { TOPICS_DATA } from '@/data/topics';

const TOPICS_STORAGE_KEY = 'app_topics';
const TOPICS_TIMESTAMP_KEY = 'app_topics_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class TopicsService {
  private static instance: TopicsService;
  private topics: Topic[] = [];
  private initialized = false;

  private constructor() {}

  static getInstance(): TopicsService {
    if (!TopicsService.instance) {
      TopicsService.instance = new TopicsService();
    }
    return TopicsService.instance;
  }

  // Initialize topics on app start
  async initialize(): Promise<Topic[]> {
    if (this.initialized && this.topics.length > 0) {
      return this.topics;
    }

    try {
      // Check if we have cached topics
      const cachedTopics = this.getCachedTopics();
      
      if (cachedTopics && this.isCacheValid()) {
        this.topics = cachedTopics;
        this.initialized = true;
        
        // Fetch fresh data in background
        this.fetchAndUpdateTopics();
        
        return this.topics;
      }

      // If no cache or cache is invalid, fetch from API
      const freshTopics = await this.fetchTopics();
      if (freshTopics && freshTopics.length > 0) {
        this.topics = freshTopics;
        this.cacheTopics(freshTopics);
      } else {
        // Fallback to static data if API fails
        this.topics = TOPICS_DATA;
        this.cacheTopics(TOPICS_DATA);
      }

      this.initialized = true;
      return this.topics;
    } catch (error) {
      console.error('Failed to initialize topics:', error);
      
      // Fallback to static data
      this.topics = TOPICS_DATA;
      this.initialized = true;
      return this.topics;
    }
  }

  // Get topics synchronously (must be initialized first)
  getTopics(): Topic[] {
    if (!this.initialized) {
      console.warn('Topics not initialized, returning static data');
      return TOPICS_DATA;
    }
    return this.topics;
  }

  // Get a specific topic by ID
  getTopicById(id: number): Topic | undefined {
    return this.getTopics().find(topic => topic.id === id);
  }

  // Get a specific subtopic
  getSubtopicById(topicId: number, subtopicId: number) {
    const topic = this.getTopicById(topicId);
    return topic?.subtopics.find(sub => sub.id === subtopicId);
  }

  // Get all subtopics across all topics
  getAllSubtopics() {
    return this.getTopics().flatMap(topic =>
      topic.subtopics.map(subtopic => ({
        ...subtopic,
        topicId: topic.id,
        topicName: topic.name
      }))
    );
  }

  // Search topics and subtopics
  searchTopics(query: string): Array<{
    topic: Topic;
    matchedSubtopics?: Array<{ id: number; name: string }>;
  }> {
    const normalizedQuery = query.toLowerCase();
    const results: Array<{
      topic: Topic;
      matchedSubtopics?: Array<{ id: number; name: string }>;
    }> = [];

    this.getTopics().forEach(topic => {
      const topicMatches = topic.name.toLowerCase().includes(normalizedQuery);
      const matchedSubtopics = topic.subtopics.filter(sub =>
        sub.name.toLowerCase().includes(normalizedQuery)
      );

      if (topicMatches || matchedSubtopics.length > 0) {
        results.push({
          topic,
          matchedSubtopics: matchedSubtopics.length > 0 ? matchedSubtopics : undefined
        });
      }
    });

    return results;
  }

  // Private methods
  private getCachedTopics(): Topic[] | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(TOPICS_STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to parse cached topics:', error);
      return null;
    }
  }

  private cacheTopics(topics: Topic[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics));
      localStorage.setItem(TOPICS_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Failed to cache topics:', error);
    }
  }

  private isCacheValid(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const timestamp = localStorage.getItem(TOPICS_TIMESTAMP_KEY);
      if (!timestamp) return false;
      
      const age = Date.now() - parseInt(timestamp, 10);
      return age < CACHE_DURATION;
    } catch {
      return false;
    }
  }

  private async fetchTopics(): Promise<Topic[] | null> {
    try {
      // Using the API client
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/common/topics?tree=true`);
      if (!response.ok) throw new Error('Failed to fetch topics');
      
      const data: TopicsResponse = await response.json();
      return data.topics;
    } catch (error) {
      console.error('Failed to fetch topics from API:', error);
      return null;
    }
  }

  private async fetchAndUpdateTopics(): Promise<void> {
    try {
      const freshTopics = await this.fetchTopics();
      if (freshTopics && freshTopics.length > 0) {
        this.topics = freshTopics;
        this.cacheTopics(freshTopics);
      }
    } catch (error) {
      console.error('Background topics update failed:', error);
    }
  }

  // Clear cache (useful for testing or forcing refresh)
  clearCache(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(TOPICS_STORAGE_KEY);
    localStorage.removeItem(TOPICS_TIMESTAMP_KEY);
    this.initialized = false;
    this.topics = [];
  }
}

// Export singleton instance
export const topicsService = TopicsService.getInstance();