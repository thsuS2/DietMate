import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const RecordScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📝 기록</Text>
        <Text style={styles.description}>
          식단, 운동, 몸무게, 수분, 메모를 기록하세요.
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

export default RecordScreen;

