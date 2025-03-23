import React from "react";
import { FlatList, Image } from "react-native";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { t } from "i18next";
import useFetchCategory from "@/hooks/useFetchCategory";

import commonColor from "@/theme/commonColor";
import variables from "@/theme/commonColor";
import { Spinner } from "tamagui";

const CategoryScreen = () => {
  const { category, isLoading, onLoadMore, skills, metaCategory, metaSkill } =
    useFetchCategory();
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("category.title")}</Text>
          <TouchableOpacity>
            <Text style={styles.showAll}>
              {t("category.showAll", { defaultValue: "Show All" })}
            </Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View>
            <Spinner />
          </View>
        ) : (
          <FlatList
            style={styles.itemsContainer}
            data={category}
            keyExtractor={(item) => item.id}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.topicItem}>
                <Text
                  style={styles.topicText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>

      {/* Skill Evaluations Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t("category.skillEvaluations", {
              defaultValue: "Skill Evaluations",
            })}
          </Text>
          <TouchableOpacity>
            <Text style={styles.showAll}>
              {t("category.showAll", { defaultValue: "Show All" })}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View>
            <Spinner />
          </View>
        ) : (
          <FlatList
            style={styles.itemsContainer}
            data={skills}
            keyExtractor={(item) => item.id}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.skillCard}>
                <Text
                  style={styles.skillText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            onEndReached={() => onLoadMore("skill")}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: variables.scale(32),
  },
  section: {
    marginBottom: variables.scale(48),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: variables.scale(32),
    paddingHorizontal: variables.scale(20),
  },
  sectionTitle: {
    fontSize: variables.scale(34),
    fontWeight: "700",
    color: variables.colorSecondary,
    fontFamily: commonColor.fontFamily,
  },
  showAll: {
    color: variables.colorPrimary,
    fontWeight: "700",
    fontSize: variables.scale(26),
    fontFamily: commonColor.fontFamily,
  },
  topicItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: variables.scale(32),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  topicText: {
    fontSize: variables.scale(40),
    color: variables.colorSecondary,
    fontFamily: commonColor.fontFamily,
    fontWeight: "400",
  },
  skillCard: {
    backgroundColor: "#fff",
    padding: variables.scale(44),
    borderRadius: variables.scale(10),
    borderWidth: 1,
    borderColor: "#D9D9D9",
    marginVertical: variables.scale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  skillText: {
    fontSize: variables.scale(30),
    color: "black",
    fontWeight: "700",
    fontFamily: commonColor.fontFamily,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#fff",
    paddingHorizontal: variables.scale(32),
    paddingVertical: variables.scale(16),
    borderRadius: variables.scale(40),
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: variables.scale(20),
  },
  tagText: {
    fontSize: variables.scale(28),
    color: "black",
    fontWeight: "500",
  },
  itemsContainer: {
    paddingHorizontal: variables.scale(32),
    maxHeight: variables.scale(600),
  },
});

export default CategoryScreen;
