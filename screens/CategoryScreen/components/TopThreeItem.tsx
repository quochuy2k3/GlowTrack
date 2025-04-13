import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Image, Text } from 'react-native';
import LeaderboardItem from './LeaderboardItem';
import UserRankCard from './UserRankCardProps';

const TopThreeItem = ({ user, rank }: { user: any; rank: number }) => {
  const isFirst = rank === 1;
  return (
    <View style={[styles.topThreeItem]}>
      <View style={[styles.rankIndicator, isFirst && { backgroundColor: '#FFD700' }]}>
        <Text style={styles.rankNumber}>{rank}</Text>
      </View>
      <Image
        source={{ uri: user.avatar }}
        style={[
          styles.topThreeAvatar,
          isFirst && {
            width: 90,
            height: 90,
            borderRadius: 45,
            borderWidth: 3,
            borderColor: '#FFD700',
          },
        ]}
      />
      <Text style={[styles.topThreeName, isFirst && { fontSize: 16, fontWeight: '700' }]}>
        {user.name}
      </Text>
      <Text style={[styles.topThreeXP, isFirst && { fontSize: 14 }]}>
        {user.xp.toLocaleString()}xp
      </Text>
    </View>
  );
};

interface User {
  id: string;
  name: string;
  xp: number;
  avatar: string;
  rank?: number;
}

interface LeaderboardListProps {
  users: User[];
  currentUser: User;
}

export default function LeaderboardList({ users, currentUser }: LeaderboardListProps) {
  const [reachedEnd, setReachedEnd] = useState(false);

  const isUserInView = users.some(user => user.id === currentUser.id);
  const topThree = users.slice(0, 3);
  const remainingUsers = users.filter((_, index) => index >= 3);

  const renderItem = ({ item, index }: { item: User; index: number }) => (
    <LeaderboardItem
      rank={index + 1}
      name={item.name}
      xp={item.xp}
      avatar={item.avatar}
      isCurrentUser={item.id === currentUser.id}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.topThreeContainer}>
        <View style={styles.topThreeRow}>
          <TopThreeItem user={topThree[1]} rank={2} />
          <TopThreeItem user={topThree[0]} rank={1} />
          <TopThreeItem user={topThree[2]} rank={3} />
        </View>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={remainingUsers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={() => setReachedEnd(true)}
        onEndReachedThreshold={0.0}
        onScrollBeginDrag={() => {
          if (reachedEnd) setReachedEnd(false);
        }}
        ListFooterComponent={
          !isUserInView && reachedEnd ? (
            <UserRankCard
              rank={currentUser.rank || 0}
              name={currentUser.name}
              xp={currentUser.xp}
              avatar={currentUser.avatar}
            />
          ) : null
        }
      />

      {!isUserInView && !reachedEnd && (
        <View style={styles.currentUserContainer}>
          <UserRankCard
            rank={currentUser.rank || 0}
            name={currentUser.name}
            xp={currentUser.xp}
            avatar={currentUser.avatar}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topThreeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topThreeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  topThreeItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  rankIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#fff',
  },
  rankNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  topThreeAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  topThreeName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  topThreeXP: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  currentUserContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  footerUserCard: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  separator: {
    marginVertical: 5,
  },
});
