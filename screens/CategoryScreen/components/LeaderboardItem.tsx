import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface LeaderboardItemProps {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export default function LeaderboardItem({
  rank,
  name,
  xp,
  avatar,
  isCurrentUser,
}: LeaderboardItemProps) {
  return (
    <View
      style={[
        styles.container,
        isCurrentUser && styles.currentUserContainer,
        styles.topThreeContainer,
      ]}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>{rank}</Text>
      </View>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.xp}>{xp.toLocaleString()}xp</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 12,
  },
  currentUserContainer: {
    backgroundColor: '#f0fff4',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  topThreeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  medal: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
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
