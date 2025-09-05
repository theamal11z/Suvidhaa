import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loadUser } = useStore();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      // User is set up, go to main app
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleGetStarted = () => {
    router.push('/user-setup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="library-outline" size={60} color="#2196F3" />
          <Text style={styles.appName}>सुविधा</Text>
          <Text style={styles.tagline}>Your Bridge to Transparent Governance</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="document-text-outline" size={40} color="#4CAF50" />
            <Text style={styles.featureTitle}>UNDERSTAND</Text>
            <Text style={styles.featureDesc}>AI-powered document simplification</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="chatbubbles-outline" size={40} color="#FF9800" />
            <Text style={styles.featureTitle}>ACT</Text>
            <Text style={styles.featureDesc}>Submit questions & suggestions</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="analytics-outline" size={40} color="#9C27B0" />
            <Text style={styles.featureTitle}>TRACK</Text>
            <Text style={styles.featureDesc}>Monitor progress & transparency</Text>
          </View>
        </View>

        <View style={styles.missionContainer}>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            Empower every citizen to understand, engage with, and receive solutions from their government through transparent, accessible civic participation.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.byText}>By RaaStafix</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 0.5,
    padding: 24,
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  missionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  missionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  getStartedButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  byText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});