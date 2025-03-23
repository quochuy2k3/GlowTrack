import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CancelIcon from "../../../assets/svgs/DotIcon";
import AddIcon from "../../../assets/svgs/addIcon";
import CardPhaseSecond from "./CardPhaseSecond";
import variables from "@/theme/commonColor";
import useFetchCareerGoal from "../../../hooks/useFetchCareerGoal";
import commonColor from "@/theme/commonColor";
import DownIcon from "../../../assets/svgs/downIcon";
import { Spinner } from "tamagui";
import { useTranslation } from "react-i18next";

export default function SetCareerGoal({ setCareerGoal }) {
  const { t } = useTranslation();
  const {
    isLoading,
    submitCareerGoal,
    isLoadingMore,
    userSettingsCareerGoal,
    phase,
    setPhase,
    removeSkill,
    addSkill,
    setCareerFocus,
    loadMoreItems,
  } = useFetchCareerGoal();

  const [textCareerGoal, setTextCareerGoal] = useState({
    title: "",
    description: "",
    picked: "",
    suggested: "",
  });

  useEffect(() => {
    if (phase === 1) {
      setTextCareerGoal({
        title: t("skill_question"),
        description: t("skill_description"),
        picked: t("skill_picked"),
        suggested: t("skill_suggested"),
      });
    } else if (phase === 2) {
      setTextCareerGoal({
        title: t("career_goal_question"),
        description: t("career_goal_description"),
      });
    } else if (phase === 3) {
      setTextCareerGoal({
        title: t("job_interest_question"),
        description: t("job_interest_description"),
        picked: t("job_interest_picked"),
        suggested: t("job_interest_suggested"),
      });
    } else if (phase === 4) {
      setCareerGoal(true);
      submitCareerGoal();
    }
  }, [phase, userSettingsCareerGoal]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View style={styles.backgroundOverlay}></View>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>{textCareerGoal.title}</Text>
              <Text style={styles.description}>
                {textCareerGoal.description}
              </Text>
            </View>
            {/* Multiple choice */}
            {phase !== 2 && (
              <View style={styles.skillContainer}>
                <View style={styles.listPickedItemContainer}>
                  <Text style={styles.listText}>
                    {textCareerGoal.picked} (
                    {phase === 1
                      ? userSettingsCareerGoal.skillsObj?.length || 0
                      : userSettingsCareerGoal.rolesInterestedObj?.length || 0}
                    )
                  </Text>
                  <ScrollView
                    style={styles.listPickedItem}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                  >
                    {(phase === 1
                      ? userSettingsCareerGoal.skillsObj
                      : userSettingsCareerGoal.rolesInterestedObj || []
                    ).map((item, index) => (
                      <View key={index} style={styles.pickedItem}>
                        <Text style={styles.pickedItemText}>{item.name}</Text>
                        <TouchableOpacity
                          style={styles.pickedItemRemoveButton}
                          onPress={() => removeSkill(item)}
                        >
                          <CancelIcon width={16} height={16} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.listItemContainer}>
                  <Text style={styles.listTextSuggested}>
                    {textCareerGoal.suggested}
                  </Text>
                  <View style={styles.listItemContainerItems}>
                    <ScrollView
                      style={styles.listItem}
                      contentContainerStyle={{ flexGrow: 1 }}
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled
                    >
                      {(phase === 1
                        ? userSettingsCareerGoal.skillsSuggest
                        : userSettingsCareerGoal.jobInterests || []
                      ).map((item) => (
                        <View key={item.id} style={styles.pickedItem}>
                          <Text style={styles.pickedItemText}>{item.name}</Text>
                          <TouchableOpacity
                            style={styles.pickedItemRemoveButton}
                            onPress={() => addSkill(item)}
                          >
                            <AddIcon width={16} height={16} />
                          </TouchableOpacity>
                        </View>
                      ))}
                      {isLoadingMore && (
                        <View style={styles.loadingMoreSpinner}>
                          <Spinner />
                        </View>
                      )}
                    </ScrollView>
                  </View>
                  {(phase === 1 &&
                    userSettingsCareerGoal.metaSkills.current_page <
                      userSettingsCareerGoal.metaSkills.total_pages) ||
                  (phase === 3 &&
                    userSettingsCareerGoal.metaJobInterests.current_page <
                      userSettingsCareerGoal.metaJobInterests.total_pages) ? (
                    <View style={styles.buttonLoadMoreContainer}>
                      <TouchableOpacity
                        style={styles.buttonLoadMore}
                        onPress={loadMoreItems}
                      >
                        <Text style={styles.buttonLoadMoreText}>
                          {t("view_more")}
                        </Text>
                        <DownIcon width={13} height={13} />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            )}

            {/* IMG */}
            {phase === 2 && (
              <CardPhaseSecond
                careerFocus={userSettingsCareerGoal.careerFocus}
                setCareerFocus={setCareerFocus}
              />
            )}
            {/* Button */}
            <View style={styles.buttonContainer}>
              {phase === 1 ? (
                <TouchableOpacity
                  style={styles.buttonCancel}
                  onPress={() => setCareerGoal(true)}
                >
                  <Text style={styles.buttonCancelText}>{t("cancel")}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.buttonCancel}
                  onPress={() => setPhase(phase - 1)}
                >
                  <Text style={styles.buttonCancelText}>{t("back")}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.buttonNext}
                onPress={() => setPhase(phase + 1)}
              >
                <Text style={styles.buttonNextText}>{t("next")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundOverlay: {
    zIndex: 0,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#1ECC78",
    width: "100%",
    height: variables.scale(540),
  },
  contentContainer: {
    flex: 1,
    margin: variables.scale(40),
    marginTop: variables.scale(100),
    borderRadius: variables.scale(16),
    backgroundColor: "white",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  headerContainer: {
    paddingHorizontal: variables.scale(40),
    paddingTop: variables.scale(40),
  },
  title: {
    fontSize: variables.scale(40),
    fontWeight: "700",
    marginBottom: variables.scale(40),
    color: "#303E65",
  },
  listPickedItemContainer: {
    padding: variables.scale(40),
  },
  description: {
    fontSize: variables.scale(26),
    fontWeight: "400",
  },
  listText: {
    marginTop: variables.scale(60),
    fontSize: variables.scale(34),
    fontWeight: "700",
    color: "#303E65",
  },
  listTextSuggested: {
    paddingHorizontal: variables.scale(40),
    marginTop: variables.scale(40),
    marginBottom: variables.scale(10),
    fontSize: variables.scale(34),
    fontWeight: "700",
    color: "#303E65",
  },
  listPickedItem: {
    borderWidth: 1,
    borderColor: "#F5F5F7",
    borderRadius: 8,
    paddingRight: variables.scale(20),
    maxHeight: variables.scale(400),
    marginTop: variables.scale(40),
    minHeight: variables.scale(200),
  },
  listItemContainerItems: {
    borderTopWidth: 1,
    borderTopColor: "#F2F7FF",
    paddingHorizontal: variables.scale(40),
  },
  listItem: {
    maxHeight: variables.scale(550),
    paddingRight: variables.scale(20),
  },
  pickedItem: {
    borderWidth: 1,
    borderColor: "#B3C0E0",
    backgroundColor: "#F5F5F7",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: variables.scale(20),
    paddingVertical: variables.scale(16),
    margin: variables.scale(10),
    borderRadius: variables.scale(16),
    alignSelf: "flex-start",
  },
  pickedItemText: {
    fontSize: variables.scale(26),
    fontWeight: "400",
    color: "#303E65",
    flexShrink: 1,
  },
  pickedItemRemoveButton: {
    paddingHorizontal: variables.scale(20),
  },
  buttonContainer: {
    padding: variables.scale(40),
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: variables.scale(40),
  },
  buttonCancel: {
    width: variables.scale(280),
    height: variables.scale(100),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: variables.scale(30),
    borderWidth: 1,
    borderColor: "#1ECC78",
  },
  buttonCancelText: {
    fontSize: variables.scale(42),
    fontWeight: "500",
    color: "#1ECC78",
  },
  buttonLoadMoreContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  buttonLoadMore: {
    margin: variables.scale(40),
    flexDirection: "row",
    alignItems: "flex-end",
  },
  buttonLoadMoreText: {
    fontSize: variables.scale(26),
    fontWeight: "700",
    color: "#1ECC78",
    fontFamily: commonColor.fontFamily,
  },
  buttonNext: {
    height: variables.scale(100),
    width: variables.scale(280),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1ECC78",
    borderRadius: variables.scale(30),
  },
  buttonNextText: {
    fontSize: variables.scale(42),
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
