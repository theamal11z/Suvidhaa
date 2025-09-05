import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  name: string;
  email: string;
  phone?: string;
}

export interface Document {
  id: string;
  title: string;
  original_content: string;
  summary_english: string;
  summary_nepali?: string;
  plain_language: string;
  key_points: string[];
  affected_groups: string[];
  key_dates: string[];
  responsible_offices: string[];
  document_type: string;
  file_url?: string;
  file_base64?: string;
  created_at: string;
  processed_at?: string;
}

export interface Question {
  id: string;
  user_name: string;
  email: string;
  phone?: string;
  question_text: string;
  category: string;
  related_document_id?: string;
  evidence_urls: string[];
  evidence_base64: string[];
  government_office: string;
  status: string;
  created_at: string;
  response_text?: string;
  response_at?: string;
}

export interface Suggestion {
  id: string;
  user_name: string;
  email: string;
  suggestion_text: string;
  category: string;
  related_document_id?: string;
  co_signatures: Array<{name: string; email: string; signed_at: string}>;
  status: string;
  created_at: string;
  sentiment_summary?: string;
}

export interface Grievance {
  id: string;
  user_name: string;
  email: string;
  phone: string;
  grievance_text: string;
  category: string;
  evidence_urls: string[];
  evidence_base64: string[];
  legal_references: string[];
  affected_area: string;
  government_office: string;
  status: string;
  created_at: string;
  resolution_text?: string;
  resolved_at?: string;
}

export interface Watchlist {
  id: string;
  user_email: string;
  name: string;
  keywords: string[];
  categories: string[];
  government_offices: string[];
  notification_frequency: string;
  created_at: string;
  last_notified?: string;
}

export interface DashboardStats {
  total_documents: number;
  documents_this_month: number;
  total_questions: number;
  answered_questions: number;
  total_suggestions: number;
  total_grievances: number;
  resolved_grievances: number;
}

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Documents
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  
  // Questions
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  
  // Suggestions
  suggestions: Suggestion[];
  setSuggestions: (suggestions: Suggestion[]) => void;
  addSuggestion: (suggestion: Suggestion) => void;
  
  // Grievances
  grievances: Grievance[];
  setGrievances: (grievances: Grievance[]) => void;
  addGrievance: (grievance: Grievance) => void;
  
  // Watchlists
  watchlists: Watchlist[];
  setWatchlists: (watchlists: Watchlist[]) => void;
  addWatchlist: (watchlist: Watchlist) => void;
  
  // Dashboard
  dashboardStats: DashboardStats | null;
  setDashboardStats: (stats: DashboardStats) => void;
  
  // UI state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Persistence
  loadUser: () => Promise<void>;
  saveUser: (user: User | null) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  documents: [],
  questions: [],
  suggestions: [],
  grievances: [],
  watchlists: [],
  dashboardStats: null,
  isLoading: false,
  
  // User actions
  setUser: (user) => {
    set({ user });
    get().saveUser(user);
  },
  
  // Document actions
  setDocuments: (documents) => set({ documents }),
  addDocument: (document) => set((state) => ({ 
    documents: [document, ...state.documents] 
  })),
  
  // Question actions
  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) => set((state) => ({ 
    questions: [question, ...state.questions] 
  })),
  
  // Suggestion actions
  setSuggestions: (suggestions) => set({ suggestions }),
  addSuggestion: (suggestion) => set((state) => ({ 
    suggestions: [suggestion, ...state.suggestions] 
  })),
  
  // Grievance actions
  setGrievances: (grievances) => set({ grievances }),
  addGrievance: (grievance) => set((state) => ({ 
    grievances: [grievance, ...state.grievances] 
  })),
  
  // Watchlist actions
  setWatchlists: (watchlists) => set({ watchlists }),
  addWatchlist: (watchlist) => set((state) => ({ 
    watchlists: [watchlist, ...state.watchlists] 
  })),
  
  // Dashboard actions
  setDashboardStats: (dashboardStats) => set({ dashboardStats }),
  
  // UI actions
  setLoading: (isLoading) => set({ isLoading }),
  
  // Persistence
  loadUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('suvidhaa_user');
      if (userData) {
        set({ user: JSON.parse(userData) });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },
  
  saveUser: async (user) => {
    try {
      if (user) {
        await AsyncStorage.setItem('suvidhaa_user', JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem('suvidhaa_user');
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },
}));