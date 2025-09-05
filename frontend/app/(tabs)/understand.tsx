import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useStore } from '../../store/useStore';
import { apiService } from '../../services/api';

export default function UnderstandScreen() {
  const { documents, setDocuments, addDocument, isLoading, setLoading } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await apiService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
      Alert.alert('Error', 'Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Get document details from user
        Alert.prompt(
          'Document Title',
          'Please enter a title for this document:',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Upload',
              onPress: async (title) => {
                if (!title || !title.trim()) {
                  Alert.alert('Error', 'Please enter a valid title');
                  return;
                }
                
                try {
                  setLoading(true);
                  const document = await apiService.uploadDocument(file, title.trim(), 'Policy Document');
                  addDocument(document);
                  Alert.alert('Success', 'Document uploaded and processed successfully!');
                } catch (error) {
                  console.error('Upload failed:', error);
                  Alert.alert('Error', 'Failed to upload document. Please try again.');
                } finally {
                  setLoading(false);
                }
              },
            },
          ],
          'plain-text'
        );
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const DocumentCard = ({ document }: { document: any }) => (
    <View style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <Ionicons name="document-text" size={24} color="#2196F3" />
        <View style={styles.documentTitleContainer}>
          <Text style={styles.documentTitle}>{document.title}</Text>
          <Text style={styles.documentType}>{document.document_type}</Text>
        </View>
        <View style={styles.documentStatus}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
        </View>
      </View>
      
      <View style={styles.documentContent}>
        <Text style={styles.sectionTitle}>AI Summary</Text>
        <Text style={styles.summaryText}>{document.summary_english}</Text>
        
        {document.key_points && document.key_points.length > 0 && (
          <View style={styles.keyPointsContainer}>
            <Text style={styles.sectionTitle}>Key Points</Text>
            {document.key_points.slice(0, 3).map((point: string, index: number) => (
              <View key={index} style={styles.keyPoint}>
                <Ionicons name="chevron-forward" size={16} color="#2196F3" />
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))}
          </View>
        )}
        
        {document.plain_language && (
          <View style={styles.plainLanguageContainer}>
            <Text style={styles.sectionTitle}>Plain Language Explanation</Text>
            <Text style={styles.plainLanguageText}>{document.plain_language}</Text>
          </View>
        )}
        
        <View style={styles.metadataContainer}>
          {document.affected_groups && document.affected_groups.length > 0 && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Affected Groups:</Text>
              <Text style={styles.metadataValue}>{document.affected_groups.slice(0, 2).join(', ')}</Text>
            </View>
          )}
          
          {document.responsible_offices && document.responsible_offices.length > 0 && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Responsible Offices:</Text>
              <Text style={styles.metadataValue}>{document.responsible_offices.slice(0, 2).join(', ')}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.documentFooter}>
        <Text style={styles.dateText}>
          Processed: {new Date(document.processed_at || document.created_at).toLocaleDateString()}
        </Text>
        <TouchableOpacity style={styles.viewFullButton}>
          <Text style={styles.viewFullText}>View Full</Text>
          <Ionicons name="arrow-forward" size={16} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Government Document Simplification</Text>
          <Text style={styles.headerSubtitle}>
            Upload documents to get AI-powered summaries in plain language
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={handleUploadDocument}
          disabled={isLoading}
        >
          <Ionicons name="cloud-upload-outline" size={28} color="#fff" />
          <Text style={styles.uploadButtonText}>
            {isLoading ? 'Processing...' : 'Upload Document'}
          </Text>
        </TouchableOpacity>

        <View style={styles.documentsSection}>
          <Text style={styles.sectionHeader}>Recent Documents</Text>
          
          {documents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={64} color="#E0E0E0" />
              <Text style={styles.emptyStateTitle}>No Documents Yet</Text>
              <Text style={styles.emptyStateText}>
                Upload your first government document to get started with AI-powered simplification
              </Text>
            </View>
          ) : (
            documents.map((document, index) => (
              <DocumentCard key={document.id || index} document={document} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    margin: 24,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  documentsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  documentType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  documentStatus: {
    marginLeft: 8,
  },
  documentContent: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  keyPointsContainer: {
    marginBottom: 16,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  keyPointText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  plainLanguageContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  plainLanguageText: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
  metadataContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metadataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 120,
  },
  metadataValue: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewFullText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
});