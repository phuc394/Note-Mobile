import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Profile</Text>

      <TouchableOpacity style={styles.settingBtn}>
        <Text style={styles.settingText}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#111827',
  },

  settingBtn: {
    backgroundColor: '#f3f4f6',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingText: {
    fontSize: 20,
  },
});