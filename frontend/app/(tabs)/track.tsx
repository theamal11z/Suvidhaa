import React, { useState, useEffect } from 'react';
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
import { useStore } from '../../store/useStore';
import { apiService } from '../../services/api';

export default function TrackScreen() {
  const { 
    dashboardStats, 
    setDashboardStats, 
    watchlists, 
    setWatchlists,
    user,
    isLoading, 
    setLoading 
  } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats);
      
      // Load watchlists if user exists
      if (user?.email) {
        const userWatchlists = await apiService.getWatchlists(user.email);
        setWatchlists(userWatchlists);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleCreateWatchlist = () => {
    if (!user?.email) {
      Alert.alert('Setup Required', 'Please setup your profile first to create watchlists.');
      return;
    }

    Alert.prompt(
      'Create Watchlist',
      'Enter a name for your watchlist:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async (name) => {
            if (!name || !name.trim()) {
              Alert.alert('Error', 'Please enter a valid name');
              return;
            }

            try {
              setLoading(true);
              const watchlistData = {
                user_email: user.email,
                name: name.trim(),
                keywords: ['policy', 'budget', 'development'],
                categories: ['General'],
                government_offices: ['Local Government'],
                notification_frequency: 'weekly'
              };
              
              const newWatchlist = await apiService.createWatchlist(watchlistData);
              setWatchlists([newWatchlist, ...watchlists]);
              Alert.alert('Success', 'Watchlist created successfully!');
            } catch (error) {
              console.error('Failed to create watchlist:', error);
              Alert.alert('Error', 'Failed to create watchlist. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    color 
  }: {
    icon: string;
    title: string;
    value: number;
    subtitle?: string;
    color: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon as any} size={28} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value.toLocaleString()}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const WatchlistCard = ({ watchlist }: { watchlist: any }) => (
    <View style={styles.watchlistCard}>
      <View style={styles.watchlistHeader}>
        <Ionicons name="eye-outline" size={24} color="#2196F3" />
        <View style={styles.watchlistTitleContainer}>
          <Text style={styles.watchlistTitle}>{watchlist.name}</Text>
          <Text style={styles.watchlistFrequency}>
            Notifications: {watchlist.notification_frequency}
          </Text>
        </View>
        <TouchableOpacity style={styles.watchlistMenuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.watchlistContent}>
        <View style={styles.watchlistKeywords}>
          {watchlist.keywords.slice(0, 3).map((keyword: string, index: number) => (
            <View key={index} style={styles.keywordChip}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.watchlistMeta}>
          Created: {new Date(watchlist.created_at).toLocaleDateString()}
        </Text>
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
          <Text style={styles.headerTitle}>Public Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Track government transparency and your personal watchlists
          </Text>
        </View>

        {dashboardStats && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Platform Statistics</Text>
            
            <View style={styles.statsRow}>
              <StatCard
                icon="document-text-outline"
                title="Documents"
                value={dashboardStats.total_documents}
                subtitle={`${dashboardStats.documents_this_month} this month`}
                color="#4CAF50"
              />
              
              <StatCard
                icon="help-circle-outline"
                title="Questions"
                value={dashboardStats.total_questions}
                subtitle={`${dashboardStats.answered_questions} answered`}
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
                subtitle={`${dashboardStats.resolved_grievances} resolved`}
                color="#F44336"
              />
            </View>
          </View>
        )}

        <View style={styles.watchlistsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Watchlists</Text>
            <TouchableOpacity 
              style={styles.createWatchlistButton} 
              onPress={handleCreateWatchlist}
              disabled={isLoading}
            >
              <Ionicons name="add" size={20} color="#2196F3" />
              <Text style={styles.createWatchlistText}>Create</Text>
            </TouchableOpacity>
          </View>
          
          {watchlists.length === 0 ? (
            <View style={styles.emptyWatchlists}>
              <Ionicons name="eye-off-outline" size={64} color="#E0E0E0" />
              <Text style={styles.emptyWatchlistsTitle}>No Watchlists Yet</Text>
              <Text style={styles.emptyWatchlistsText}>
                Create watchlists to get notified about specific topics, keywords, or government offices
              </Text>
              <TouchableOpacity 
                style={styles.emptyWatchlistsButton} 
                onPress={handleCreateWatchlist}
              >
                <Text style={styles.emptyWatchlistsButtonText}>Create First Watchlist</Text>
              </TouchableOpacity>
            </View>
          ) : (
            watchlists.map((watchlist, index) => (
              <WatchlistCard key={watchlist.id || index} watchlist={watchlist} />
            ))
          )}
        </View>

        <View style={styles.transparencySection}>
          <Text style={styles.sectionTitle}>Transparency Metrics</Text>
          
          <View style={styles.transparencyCard}>
            <View style={styles.transparencyHeader}>
              <Ionicons name="analytics-outline" size={28} color="#9C27B0" />
              <Text style={styles.transparencyTitle}>Response Rate</Text>
            </View>
            <View style={styles.transparencyContent}>
              <Text style={styles.transparencyValue}>
                {dashboardStats ? 
                  Math.round((dashboardStats.answered_questions / (dashboardStats.total_questions || 1)) * 100) + '%'
                  : '0%'
                }
              </Text>
              <Text style={styles.transparencyLabel}>Questions Answered</Text>
            </View>
          </View>

          <View style={styles.transparencyCard}>
            <View style={styles.transparencyHeader}>
              <Ionicons name="checkmark-circle-outline" size={28} color="#4CAF50" />
              <Text style={styles.transparencyTitle}>Resolution Rate</Text>
            </View>
            <View style={styles.transparencyContent}>
              <Text style={styles.transparencyValue}>
                {dashboardStats ? 
                  Math.round((dashboardStats.resolved_grievances / (dashboardStats.total_grievances || 1)) * 100) + '%'
                  : '0%'
                }
              </Text>
              <Text style={styles.transparencyLabel}>Grievances Resolved</Text>
            </View>
          </View>
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
  statsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  watchlistsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  createWatchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createWatchlistText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 4,
  },
  watchlistCard: {
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
  watchlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  watchlistTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  watchlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  watchlistFrequency: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  watchlistMenuButton: {
    padding: 4,
  },
  watchlistContent: {
    marginLeft: 36,
  },
  watchlistKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  keywordChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  keywordText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  watchlistMeta: {
    fontSize: 12,
    color: '#999',
  },
  emptyWatchlists: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyWatchlistsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyWatchlistsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  emptyWatchlistsButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyWatchlistsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  transparencySection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  transparencyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transparencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transparencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  transparencyContent: {
    alignItems: 'center',
  },
  transparencyValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  transparencyLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});