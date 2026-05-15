import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileStats = () => {
  return (
    <View style={styles.statsContainer}>

      <View style={styles.statBox}>
        <Text style={styles.statNumber}>32</Text>
        <Text style={styles.statLabel}>Notes</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statNumber}>12</Text>
        <Text style={styles.statLabel}>Folders</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statNumber}>256</Text>
        <Text style={styles.statLabel}>Tasks</Text>
      </View>

    </View>
  );
};

export default ProfileStats;

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },

  statBox: {
    backgroundColor: '#f9fafb',
    width: '31%',
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },

  statLabel: {
    color: '#6b7280',
    marginTop: 8,
  },
});