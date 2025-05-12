// eslint-disable-next-line prettier/prettier
import { useAuth } from '@/contexts/auth';
import { useServices } from '@/services';
import { CoupleResponse } from '@/services/couple/couple.service';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Spinner, Text, View } from 'tamagui';

import { AddFriend } from './components/AddFriend';
import { CoupleDetail } from './components/CoupleDetail';

const CoupleScreen = () => {
  const services = useServices();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [couple, setCouple] = useState<CoupleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch couple data
  const fetchCoupleData = async () => {
    try {
      setIsLoading(true);
      const response = await services.couple.getCouple();
      if (response) {
        console.log('fetchCoupleData response:', response);
        setCouple(response);
      } else {
        setCouple(null);
      }
    } catch (error) {
      console.error('Failed to fetch couple:', error);
      setCouple(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data whenever the tab comes into focus
  useEffect(() => {
    if (isFocused) {
      fetchCoupleData();
    }
  }, [isFocused]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Spinner size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // No couple - Show AddFriend component
  if (!couple || !couple.partner) {
    return (
      <SafeAreaView style={styles.container}>
        <AddFriend setCouple={setCouple} />
      </SafeAreaView>
    );
  }

  // Has couple - Show CoupleDetail component
  return (
    <SafeAreaView style={styles.container}>
      <CoupleDetail couple={couple} setCouple={setCouple} onCoupleRemoved={fetchCoupleData} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#3498db',
  },
});

export default CoupleScreen;
