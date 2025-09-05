import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { apiService } from '../../services/api';
import { UserProfile } from '../../components/UserProfile';

export default function ProfileScreen() {
  const { user, questions, suggestions, grievances, setQuestions, setSuggestions, setGrievances, setLoading } = useStore();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [submissionStats, setSubmissionStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    totalSuggestions: 0,
    totalGrievances: 0,
    resolvedGrievances: 0,
  });

  useEffect(() => {
    if (user?.email) {
      loadUserSubmissions();
    }
  }, [user]);

  const loadUserSubmissions = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const submissions = await apiService.getUserSubmissions(user.email);
      
      setQuestions(submissions.questions || []);
      setSuggestions(submissions.suggestions || []);
      setGrievances(submissions.grievances || []);
      
      // Calculate stats
      const stats = {
        totalQuestions: submissions.questions?.length || 0,
        answeredQuestions: submissions.questions?.filter((q: any) => q.status === 'answered')?.length || 0,
        totalSuggestions: submissions.suggestions?.length || 0,
        totalGrievances: submissions.grievances?.length || 0,
        resolvedGrievances: submissions.grievances?.filter((g: any) => g.status === 'resolved')?.length || 0,
      };
      
      setSubmissionStats(stats);
    } catch (error) {
      console.error('Failed to load user submissions:', error);
      Alert.alert('Error', 'Failed to load your submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowUserProfile(true);
  };

  const handleBackToProfile = () => {
    setShowUserProfile(false);
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
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const RecentSubmissionCard = ({ 
    item, 
    type 
  }: {
    item: any;
    type: 'question' | 'suggestion' | 'grievance';
  }) => {
    const getIcon = () => {
      switch (type) {
        case 'question': return 'help-circle-outline';
        case 'suggestion': return 'bulb-outline';
        case 'grievance': return 'shield-outline';
      }
    };

    const getColor = () => {
      switch (type) {
        case 'question': return '#4CAF50';
        case 'suggestion': return '#FF9800';
        case 'grievance': return '#F44336';
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'answered': case 'resolved': return '#4CAF50';
        case 'under_review': case 'routed': return '#FF9800';
        default: return '#666';
      }
    };

    const getText = () => {
      switch (type) {
        case 'question': return item.question_text;
        case 'suggestion': return item.suggestion_text;
        case 'grievance': return item.grievance_text;
      }
    };

    return (
      <View style={styles.submissionCard}>
        <View style={styles.submissionHeader}>
          <Ionicons name={getIcon() as any} size={20} color={getColor()} />
          <Text style={styles.submissionType}>{type.toUpperCase()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.submissionText} numberOfLines={2}>
          {getText()}
        </Text>
        <Text style={styles.submissionDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  if (showUserProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToProfile}>
            <Ionicons name="arrow-back" size={24} color="#2196F3" />
          </TouchableOpacity>
          <Text style={styles.profileHeaderTitle}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <UserProfile />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.setupPrompt}>
          <Ionicons name="person-add-outline" size={80} color="#E0E0E0" />
          <Text style={styles.setupTitle}>Setup Your Profile</Text>
          <Text style={styles.setupText}>
            Please set up your profile to start using Suvidhaa and track your submissions
          </Text>
          <TouchableOpacity style={styles.setupButton} onPress={handleEditProfile}>
            <Text style={styles.setupButtonText}>Setup Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Get recent submissions (last 3)
  const recentSubmissions = [
    ...questions.slice(0, 1).map(q => ({ ...q, type: 'question' })),
    ...suggestions.slice(0, 1).map(s => ({ ...s, type: 'suggestion' })),
    ...grievances.slice(0, 1).map(g => ({ ...g, type: 'grievance' })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#2196F3" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>My Activity</Text>
          
          <View style={styles.statsRow}>
            <StatCard
              icon="help-circle-outline"
              title="Questions"
              value={submissionStats.totalQuestions}
              subtitle={`${submissionStats.answeredQuestions} answered`}
              color="#4CAF50"
            />
            
            <StatCard
              icon="bulb-outline"
              title="Suggestions"
              value={submissionStats.totalSuggestions}
              color="#FF9800"
            />
          </View>
          
          <View style={styles.statsRow}>
            <StatCard
              icon="shield-outline"
              title="Grievances"
              value={submissionStats.totalGrievances}
              subtitle={`${submissionStats.resolvedGrievances} resolved`}
              color="#F44336"
            />
            
            <StatCard
              icon="analytics-outline"
              title="Total"
              value={submissionStats.totalQuestions + submissionStats.totalSuggestions + submissionStats.totalGrievances}
              subtitle="All submissions"
              color="#2196F3"
            />
          </View>
        </View>

        {recentSubmissions.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Submissions</Text>
            {recentSubmissions.map((item, index) => (
              <RecentSubmissionCard 
                key={`${item.type}_${item.id}_${index}`} 
                item={item} 
                type={item.type as any} 
              />
            ))}
          </View>
        )}

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon.')}>
            <Ionicons name="notifications-outline" size={24} color="#2196F3" />
            <Text style={styles.actionText}>Notification Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#C0C0C0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={loadUserSubmissions}>
            <Ionicons name="refresh-outline" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Refresh Data</Text>
            <Ionicons name="chevron-forward" size={20} color="#C0C0C0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Coming Soon', 'Export feature will be available soon.')}>
            <Ionicons name="download-outline" size={24} color="#FF9800" />
            <Text style={styles.actionText}>Export My Data</Text>
            <Ionicons name="chevron-forward" size={20} color="#C0C0C0" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Suvidhaa v1.0 - Your Bridge to Transparent Governance
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  profileHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  setupPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  setupText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  setupButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSection: {
    backgroundColor: '#fff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 24,
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
    fontSize: 18,
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
  recentSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  submissionCard: {
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
  submissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  submissionType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  submissionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  submissionDate: {
    fontSize: 12,
    color: '#999',
  },
  actionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
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
    textAlign: 'center',
    marginBottom: 4,
  },
});