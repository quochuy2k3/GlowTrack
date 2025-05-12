import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import { WeatherFolder } from './components/WeatherFolder';
import { StreakFolder } from './components/StreakFolder';
const width = Dimensions.get('window').width;

export default function GridFolder({ streak }: { streak: number }) {
  const [data, setData] = useState([
    { key: '1', title: 'Folder 1', description: 'Description 1' },
    { key: '2', title: 'Folder 2', description: 'Description 2' },
  ]);

  const renderItem = ({ item, drag, isActive }: any) => {
    if (item.key === '1') {
      return <WeatherFolder item={item} drag={drag} isActive={isActive} />;
    } else {
      return <StreakFolder item={item} drag={drag} isActive={isActive} streak={streak} />;
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureHandlerRootView}>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        onDragEnd={({ data }) => setData(data)}
        contentContainerStyle={styles.draggableFlatList}
        scrollEnabled={false}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  folderContainer: {
    backgroundColor: 'red',
    width: width / 2 - variables.scale(30),
    height: variables.scale(360),
    borderRadius: variables.scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    backgroundColor: 'blue',
    width: width / 2 - variables.scale(30),
    height: variables.scale(360),
    borderRadius: variables.scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: variables.scale(20),
  },
  draggableFlatList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: variables.scale(20),
  },
  gestureHandlerRootView: {
    marginTop: variables.scale(20),
  },
});
