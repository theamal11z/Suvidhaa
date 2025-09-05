import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.backendUrl || process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // Documents
  uploadDocument: async (file: any, title: string, documentType: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.mimeType || 'application/pdf',
      name: file.name || 'document.pdf',
    } as any);
    formData.append('title', title);
    formData.append('document_type', documentType);
    
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getDocuments: async (skip = 0, limit = 20) => {
    const response = await api.get(`/documents?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  getDocument: async (documentId: string) => {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  },
  
  // Questions
  submitQuestion: async (questionData: any, evidenceFiles: any[] = []) => {
    const formData = new FormData();
    
    // Add question data
    Object.keys(questionData).forEach(key => {
      formData.append(key, questionData[key]);
    });
    
    // Add evidence files
    evidenceFiles.forEach((file, index) => {
      formData.append('evidence_files', {
        uri: file.uri,
        type: file.mimeType || 'image/jpeg',
        name: file.name || `evidence_${index}.jpg`,
      } as any);
    });
    
    const response = await api.post('/questions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Suggestions
  submitSuggestion: async (suggestionData: any) => {
    const response = await api.post('/suggestions', suggestionData);
    return response.data;
  },
  
  cosignSuggestion: async (suggestionId: string, signerName: string, signerEmail: string) => {
    const formData = new FormData();
    formData.append('signer_name', signerName);
    formData.append('signer_email', signerEmail);
    
    const response = await api.post(`/suggestions/${suggestionId}/cosign`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Grievances
  fileGrievance: async (grievanceData: any, evidenceFiles: any[] = []) => {
    const formData = new FormData();
    
    // Add grievance data
    Object.keys(grievanceData).forEach(key => {
      formData.append(key, grievanceData[key]);
    });
    
    // Add evidence files
    evidenceFiles.forEach((file, index) => {
      formData.append('evidence_files', {
        uri: file.uri,
        type: file.mimeType || 'image/jpeg',
        name: file.name || `evidence_${index}.jpg`,
      } as any);
    });
    
    const response = await api.post('/grievances', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Watchlists
  createWatchlist: async (watchlistData: any) => {
    const response = await api.post('/watchlists', watchlistData);
    return response.data;
  },
  
  getWatchlists: async (userEmail: string) => {
    const response = await api.get(`/watchlists?user_email=${userEmail}`);
    return response.data;
  },
  
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  
  getUserSubmissions: async (userEmail: string) => {
    const response = await api.get(`/submissions?user_email=${userEmail}`);
    return response.data;
  },
};

export default api;