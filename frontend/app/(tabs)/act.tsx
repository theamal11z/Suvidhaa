import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ActScreen() {
  const router = useRouter();

  const ActionCard = ({ 
    icon, 
    title, 
    description, 
    color, 
    onPress 
  }: {
    icon: string;
    title: string;
    description: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={[styles.actionCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.actionIconContainer}>
        <Ionicons name={icon as any} size={32} color={color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#C0C0C0" />
    </TouchableOpacity>
  );

  const handleQuestionPress = () => {
    Alert.alert(
      'Ask Questions',
      'Submit questions to government offices with guided templates and evidence collection.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.push('/question-form') }
      ]
    );
  };

  const handleSuggestionPress = () => {
    Alert.alert(
      'Make Suggestions',
      'Submit structured feedback and suggestions with public co-signature support.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.push('/suggestion-form') }
      ]
    );
  };

  const handleGrievancePress = () => {
    Alert.alert(
      'File Grievance',
      'Submit formal complaints with evidence checklist and legal references.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.push('/grievance-form') }
      ]
    );
  };

  const handleMySubmissionsPress = () => {
    router.push('/my-submissions');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Engage with Government</Text>
          <Text style={styles.headerSubtitle}>
            Submit questions, suggestions, and grievances through guided processes
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Available Actions</Text>
          
          <ActionCard
            icon="help-circle-outline"
            title="सवाल - Ask Questions"
            description="Submit questions to relevant government offices with evidence support"
            color="#4CAF50"
            onPress={handleQuestionPress}
          />

          <ActionCard
            icon="bulb-outline"
            title="सुझाव - Make Suggestions"
            description="Provide structured feedback and invite community co-signatures"
            color="#FF9800"
            onPress={handleSuggestionPress}
          />

          <ActionCard
            icon="shield-outline"
            title="गुनासो - File Grievance"
            description="Submit formal complaints with comprehensive evidence collection"
            color="#F44336"
            onPress={handleGrievancePress}
          />
        </View>

        <View style={styles.trackingSection}>
          <Text style={styles.sectionTitle}>Track Your Submissions</Text>
          
          <TouchableOpacity style={styles.trackingCard} onPress={handleMySubmissionsPress}>
            <View style={styles.trackingIconContainer}>
              <Ionicons name="list-outline" size={28} color="#2196F3" />
            </View>
            <View style={styles.trackingContent}>
              <Text style={styles.trackingTitle}>My Submissions</Text>
              <Text style={styles.trackingDescription}>
                View status and responses for all your questions, suggestions, and grievances
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#C0C0C0" />
          </TouchableOpacity>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Helpful Tips</Text>
          
          <View style={styles.tipCard}>
            <Ionicons name="lightbulb-outline" size={24} color="#FF9800" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Be Specific</Text>
              <Text style={styles.tipText}>
                Provide clear, specific details about your question or concern for better responses
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="camera-outline" size={24} color="#4CAF50" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Include Evidence</Text>
              <Text style={styles.tipText}>
                Attach relevant documents, photos, or evidence to support your submission
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="time-outline" size={24} color="#2196F3" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Response Times</Text>
              <Text style={styles.tipText}>
                Government offices typically respond within 15-30 working days
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All submissions are processed according to government transparency guidelines
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
  actionsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  actionIconContainer: {
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  trackingSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  trackingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  trackingIconContainer: {
    marginRight: 16,
  },
  trackingContent: {
    flex: 1,
  },
  trackingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  trackingDescription: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
  tipsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});