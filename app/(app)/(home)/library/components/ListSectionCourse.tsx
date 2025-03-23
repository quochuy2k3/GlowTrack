import variables from "@/theme/commonColor";
import { t } from "i18next";
import React, { Suspense } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LibraryCard from "./LibraryCard";
import { Spinner } from "tamagui";
import { Course } from "@/models";

interface ListSectionCourseProps {
  listCourses: Course[];
  handleLoadMore: () => void;
  isLoading: boolean;
  isEndReached: boolean;
}

const ListSectionCourse: React.FC<ListSectionCourseProps> = ({
  listCourses,
  handleLoadMore,
  isLoading,
  isEndReached,
}: ListSectionCourseProps) => {
  const renderItem = ({ item, index }: { item: Course; index: number }) => (
    <View key={index} style={styles.item}>
      <LibraryCard course={item} isSmall={true} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner size="large" color="$green10" />
      </View>
    );
  }

  if (!listCourses || listCourses.length === 0) {
    return (
      <View style={styles.imageContainer}>
        <Image source={require("@/assets/images/Empty.png")} />
        <Text style={styles.text}>{t("library.noData")}</Text>
      </View>
    );
  }

  return (
    <Suspense fallback={<Spinner size="large" color="$green10" />}>
      <FlatList
        data={listCourses}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <></> : null}
        style={styles.content}
      />
    </Suspense>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  item: {
    marginBottom: 10,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height * 0.5,
    marginTop: variables.scale(100),
  },
  text: {
    fontSize: variables.scale(24),
    color: "#BFBFBF",
    marginTop: variables.scale(20),
  },
});

export default ListSectionCourse;
