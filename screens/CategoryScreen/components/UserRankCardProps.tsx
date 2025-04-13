import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface UserRankCardProps {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
}

export default function UserRankCard({ rank, name, xp, avatar }: UserRankCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>{rank}</Text>
        </View>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.xp}>{xp.toLocaleString()}xp</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6ffe6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  xp: {
    fontSize: 14,
    color: '#666',
  },
});
