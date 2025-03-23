import useFetchLibrary from "@/hooks/useFetchLibrary";
import variables from "@/theme/commonColor";
import { useRouter } from "expo-router";
import { t } from "i18next";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ListSectionCourse from "./components/ListSectionCourse";

export default function LibraryScreen() {
  const router = useRouter();

  const TABS = [
    {
      id: "requireLearning",
      title: "library.require_learning",
    },
    { id: "inProgress", title: "library.in_progress" },
    { id: "savedLearning", title: "library.saved_courses" },
    { id: "courses", title: "library.other_courses" },
    {
      id: "trainings",
      title: "library.courses_programs",
    },
    {
      id: "mySkill",
      title: "library.based_on_your_skills",
    },
  ];

  const [isEndReached, setIsEndReached] = useState(false);
  const tabScrollViewRef = useRef<FlatList>(null);
  const { data, onLoadMore, isLoading, setCode, code } = useFetchLibrary();
  const handleLoadMore = () => {
    if (!isEndReached && !isLoading) {
      onLoadMore();
      setIsEndReached(true);
    }
  };

  const renderTab = (code: string) => {
    if (!code) return null;
    return (
      <ListSectionCourse
        listCourses={data}
        handleLoadMore={handleLoadMore}
        isEndReached={isEndReached}
        isLoading={isLoading}
      />
    );
  };

  const handleTabPress = (tabId: any, index: any) => {
    setCode(tabId);
    if (tabScrollViewRef.current && tabScrollViewRef.current.scrollToOffset) {
      tabScrollViewRef.current.scrollToOffset({
        offset: index * 120,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
          ref={tabScrollViewRef}
          data={TABS}
          keyExtractor={(tab) => tab.id}
          renderItem={({ item: tab, index }) => (
            <TouchableOpacity
              onPress={() => handleTabPress(tab.id, index)}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabText,
                  code === tab.id ? styles.activeTabText : null,
                ]}
              >
                {t(tab.title, { defaultValue: "" })}
              </Text>
              {code === tab.id && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.content}>{code && renderTab(code)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    backgroundColor: "white",
    borderBottomWidth: variables.scale(1),
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    paddingVertical: variables.scale(24),
    paddingHorizontal: variables.scale(20),
    position: "relative",
  },
  tabText: {
    fontSize: variables.scale(30),
    color: "black",
    fontWeight: Platform.OS === "ios" ? "500" : "bold",
  },
  activeTabText: {
    color: variables.colorPrimary,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: variables.colorPrimary,
  },
  content: {
    flex: 1,
    padding: variables.scale(20),
  },
  noDataText: {
    textAlign: "center",
    fontSize: variables.scale(28),
    color: "gray",
  },
});
