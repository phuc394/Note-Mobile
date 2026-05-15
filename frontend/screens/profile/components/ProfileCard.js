import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileCard = () => {
  return (
    <View style={styles.profileCard}>
      <Image
        source={{
          uri: 'https://i.pravatar.cc/150?img=12',
        }}
        style={styles.avatar}
      />

      <View style={styles.profileInfo}>
        <Text style={styles.name}>Kiệt Lưu</Text>

        <Text style={styles.email}>
          kietluu@gmail.com
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Premium</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#f9fafb',
    marginTop: 25,
    borderRadius: 25,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },

  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },

  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
  },

  email: {
    color: '#6b7280',
    marginTop: 5,
    fontSize: 15,
  },

  badge: {
    backgroundColor: '#8b5cf6',
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});