import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UserProfile } from '../components/UserProfile';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

export default function UserSetupScreen() {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (user) {
      // User is set up, go to main app
      router.replace('/(tabs)');
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <UserProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});