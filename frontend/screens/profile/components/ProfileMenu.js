import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

const ProfileMenu = () => {
  return (
    <View style={styles.menuContainer}>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>
          👤 Personal Information
        </Text>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>
          🔒 Change Password
        </Text>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>
          🔔 Notifications
        </Text>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <View style={styles.menuItem}>
        <Text style={styles.menuText}>
          🌙 Dark Mode
        </Text>

        <Switch value={false} />
      </View>

    </View>
  );
};

export default ProfileMenu;

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  menuText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },

  arrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
});