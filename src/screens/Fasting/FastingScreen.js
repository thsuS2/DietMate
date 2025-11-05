import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FastingScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⏰ 간헐적 단식</Text>
        <Text style={styles.description}>
          단식 시작 시간을 설정하고 관리하세요.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});

export default FastingScreen;

