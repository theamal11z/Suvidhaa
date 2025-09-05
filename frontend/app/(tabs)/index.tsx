import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { apiService } from '../../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const { 
    user, 
    documents, 
    setDocuments, 
    dashboardStats, 
    setDashboardStats,
    isLoading, 
    setLoading 
  } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      // Load recent documents
      const docs = await apiService.getDocuments(0, 5);
      setDocuments(docs);
      
      // Load dashboard stats
      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const QuickActionCard = ({ 
    icon, 
    title, 
    description, 
    color, 
    route 
  }: {
    icon: string;
    title: string;
    description: string;
    color: string;
    route: string;
  }) => (
    <TouchableOpacity 
      style={[styles.quickActionCard, { borderLeftColor: color }]} 
      onPress={() => router.push(route as any)}
    >
      <View style={styles.quickActionIconContainer}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C0C0C0" />
    </TouchableOpacity>
  );

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    color 
  }: {
    icon: string;
    title: string;
    value: number;
    color: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value.toLocaleString()}</Text>
        <Text style={styles.statTitle}>{title}</Text>
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
        {/* Welcome Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome to सुविधा
            </Text>
            {user && (
              <Text style={styles.userWelcome}>
                Hello, {user.name.split(' ')[0]}! 👋
              </Text>
            )}
            <Text style={styles.headerSubtitle}>
              Your bridge to transparent governance
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <QuickActionCard
            icon="document-text-outline"
            title="Upload Document"
            description="Get AI-powered document analysis"
            color="#4CAF50"
            route="/understand"
          />

          <QuickActionCard
            icon="help-circle-outline"
            title="Ask Question"
            description="Submit questions to government"
            color="#2196F3"
            route="/act"
          />

          <QuickActionCard
            icon="analytics-outline"
            title="Track Progress"
            description="Monitor transparency metrics"
            color="#9C27B0"
            route="/track"
          />
        </View>

        {/* Platform Stats */}
        {dashboardStats && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Platform Activity</Text>
            
            <View style={styles.statsRow}>
              <StatCard
                icon="document-text-outline"
                title="Documents"
                value={dashboardStats.total_documents}
                color="#4CAF50"
              />
              
              <StatCard
                icon="help-circle-outline"
                title="Questions"
                value={dashboardStats.total_questions}
                color="#2196F3"
              />
            </View>
            
            <View style={styles.statsRow}>
              <StatCard
                icon="bulb-outline"
                title="Suggestions"
                value={dashboardStats.total_suggestions}
                color="#FF9800"
              />
              
              <StatCard
                icon="shield-outline"
                title="Grievances"
                value={dashboardStats.total_grievances}
                color="#F44336"
              />
            </View>
          </View>
        )}

        {/* Recent Documents */}
        {documents.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Documents</Text>
              <TouchableOpacity onPress={() => router.push('/understand')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {documents.slice(0, 3).map((document, index) => (
              <View key={document.id || index} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <Ionicons name="document-text" size={20} color="#2196F3" />
                  <Text style={styles.documentTitle} numberOfLines={1}>
                    {document.title}
                  </Text>
                </View>
                <Text style={styles.documentSummary} numberOfLines={2}>
                  {document.summary_english}
                </Text>
                <Text style={styles.documentDate}>
                  {new Date(document.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Three Pillars Overview */}
        <View style={styles.pillarsSection}>
          <Text style={styles.sectionTitle}>Three Pillars of Suvidhaa</Text>
          
          <View style={styles.pillarCard}>
            <View style={styles.pillarHeader}>
              <Ionicons name="document-text" size={28} color="#4CAF50" />
              <Text style={styles.pillarTitle}>UNDERSTAND</Text>
            </View>
            <Text style={styles.pillarDescription}>
              AI-powered document simplification makes government policies accessible in plain language
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <View style={styles.pillarHeader}>
              <Ionicons name="chatbubbles" size={28} color="#FF9800" />
              <Text style={styles.pillarTitle}>ACT</Text>
            </View>
            <Text style={styles.pillarDescription}>
              Submit questions, suggestions, and grievances through guided processes
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <View style={styles.pillarHeader}>
              <Ionicons name="analytics" size={28} color="#9C27B0" />
              <Text style={styles.pillarTitle}>TRACK</Text>
            </View>
            <Text style={styles.pillarDescription}>
              Monitor transparency metrics and track your submissions with public dashboards
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with ❤️ for transparent governance
          </Text>
          <Text style={styles.footerText}>
            By RaaStafix
          </Text>
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
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  userWelcome: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  quickActionsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIconContainer: {
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#666',
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderLeftWidth: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIconContainer: {
    marginRight: 8,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 10,
    color: '#666',
  },
  recentSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  documentCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  documentSummary: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  documentDate: {
    fontSize: 12,
    color: '#999',
  },
  pillarsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  pillarCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  pillarDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});