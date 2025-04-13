import { useServices } from '@/services';
import React, { useState } from 'react';
import { SafeAreaView, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery, useInfiniteQuery } from 'react-query';
import { getToken, Spinner, Text, View, XStack } from 'tamagui';
import CategoryListItem from './components/CategoryListItem';
import { useTranslation } from 'react-i18next';
import { CircleChevronDown, CircleChevronLeft } from '@tamagui/lucide-icons';
import { useAuth } from '@/contexts/auth';
import LeaderboardList from './components/TopThreeItem';
type SectionListData = {
  queryParam: string;
  title: string;
  count: number;
  data: {
    id: string;
    name: string;
    description: string;
  }[];
};
const mockUsers = [
  {
    id: '2',
    name: 'Phet',
    xp: 11450,
    avatar: 'https://api.a0.dev/assets/image?text=confident%20young%20man%20portrait&seed=4',
  },
  {
    id: '1',
    name: 'Maxime',
    xp: 16500,
    avatar: 'https://api.a0.dev/assets/image?text=friendly%20man%20smiling&seed=2',
  },
  {
    id: '3',
    name: 'Kevin',
    xp: 10950,
    avatar: 'https://api.a0.dev/assets/image?text=tech%20enthusiast%20portrait&seed=5',
  },
  {
    id: '4',
    name: 'Henry',
    xp: 41450,
    avatar: 'https://api.a0.dev/assets/image?text=creative%20person%20portrait&seed=4',
  },
  {
    id: '5',
    name: 'Kevin',
    xp: 40950,
    avatar: 'https://api.a0.dev/assets/image?text=tech%20enthusiast%20portrait&seed=5',
  },
  {
    id: '6',
    name: 'Hector',
    xp: 39500,
    avatar: 'https://api.a0.dev/assets/image?text=friendly%20developer%20portrait&seed=6',
  },
  {
    id: '7',
    name: 'Chikanso',
    xp: 38250,
    avatar: 'https://api.a0.dev/assets/image?text=smart%20person%20portrait&seed=7',
  },
  {
    id: '8',
    name: 'Emma',
    xp: 37100,
    avatar: 'https://api.a0.dev/assets/image?text=creative%20developer%20portrait&seed=8',
  },
  {
    id: '9',
    name: 'Alex',
    xp: 36800,
    avatar: 'https://api.a0.dev/assets/image?text=tech%20professional%20portrait&seed=9',
  },
  {
    id: '10',
    name: 'Sarah',
    xp: 35500,
    avatar: 'https://api.a0.dev/assets/image?text=friendly%20programmer%20portrait&seed=10',
  },
  {
    id: '11',
    name: 'Michael',
    xp: 34200,
    avatar: 'https://api.a0.dev/assets/image?text=experienced%20coder%20portrait&seed=11',
  },
  {
    id: '12',
    name: 'Nina',
    xp: 33100,
    avatar: 'https://api.a0.dev/assets/image?text=skilled%20developer%20portrait&seed=12',
  },
  {
    id: '13',
    name: 'David',
    xp: 32000,
    avatar: 'https://api.a0.dev/assets/image?text=passionate%20coder%20portrait&seed=13',
  },
  {
    id: '14',
    name: 'Sophie',
    xp: 31500,
    avatar: 'https://api.a0.dev/assets/image?text=dedicated%20programmer%20portrait&seed=14',
  },
  {
    id: '15',
    name: 'James',
    xp: 30800,
    avatar: 'https://api.a0.dev/assets/image?text=innovative%20developer%20portrait&seed=15',
  },
];

const currentUser = {
  id: '21',
  name: 'You',
  xp: 7894,
  avatar: 'https://api.a0.dev/assets/image?text=modern%20profile%20picture&seed=21',
  rank: 21,
};

const CategoryScreen = () => {
  const services = useServices();
  const auth = useAuth();
  const { t } = useTranslation();
  const [showFriends, setShowFriends] = useState(false);

  const toggleView = () => {
    setShowFriends(!showFriends);
  };

  const filteredUsers = showFriends
    ? mockUsers.filter(user => ['1', '3', '5'].includes(user.id))
    : mockUsers;

  return (
    <SafeAreaView style={styles.container}>
      <LeaderboardList users={filteredUsers} currentUser={currentUser} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
export default CategoryScreen;
