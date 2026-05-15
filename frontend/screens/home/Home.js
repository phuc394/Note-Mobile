import React from 'react';
import { Text, View } from 'react-native';

const Home = () => (
    <View>
        <Text>Home</Text>
    </View>
);

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcome: {
    color: '#94a3b8',
    fontSize: 16,
  },

  username: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },

  searchBox: {
    backgroundColor: '#1e293b',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginTop: 25,
  },

  input: {
    color: '#fff',
    height: 50,
  },

  banner: {
    backgroundColor: '#3b82f6',
    borderRadius: 25,
    padding: 25,
    marginTop: 25,
  },

  bannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  bannerText: {
    color: '#e0e7ff',
    marginTop: 10,
    lineHeight: 22,
  },

  bannerButton: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    width: 140,
    alignItems: 'center',
  },

  bannerButtonText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },

  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#1e293b',
    width: '48%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },

  cardIcon: {
    fontSize: 30,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },

  cardDesc: {
    color: '#94a3b8',
    marginTop: 5,
  },

  task: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  taskTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  taskTime: {
    color: '#94a3b8',
    marginTop: 5,
  },

  status: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});