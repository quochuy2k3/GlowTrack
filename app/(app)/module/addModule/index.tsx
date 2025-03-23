import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { View } from "react-native";
import variables from "@/theme/commonColor";
import commonColor from "@/theme/commonColor";
import AddIcon from "../../../../assets/svgs/addIcon";
import CancelIcon from "../../../../assets/svgs/cancelIcon";
import { useTranslation } from "react-i18next";
import { useNavigation, useRouter } from "expo-router";
import useFetchCareerGoal from "../../../../hooks/useFetchCareerGoal";
import getUserOrganization from "../../../../services/user/getUserOrganization";
import { Spinner } from "tamagui";
import { useService } from "@/services";
import CustomSpinner from "@/components/ui/Spinner/Spinner";

interface PickItem {
  id: string;
  name: string;
}

const AddModule = () => {
  const service = useService();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const [pickedItem, setPickedItem] = useState<PickItem>();
  const {
    isLoading,
    isLoadingMore,
    userSettingsCareerGoal,
    setUserSettingsCareerGoal,
    setPhase,
    loadMoreItems,
  } = useFetchCareerGoal();
  const { _j: user } = getUserOrganization();
  const [isLoadingAddModule, setIsLoadingAddModule] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: t("addModule"),
      headerRight: () => (
        <TouchableOpacity onPress={() => handleAddModule()}>
          <Text style={styles.headerButtonText}>{t("add")}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, pickedItem]);

  const handleAddModule = async () => {
    if (!pickedItem) return;
    try {
      setIsLoadingAddModule(true);
      const resAddModule = await service.userPlans.addModule(
        pickedItem.name,
        pickedItem.id
      );
      if (
        Object.keys(resAddModule).length === 0 &&
        resAddModule.constructor === Object
      )
        router.back();
    } catch (error) {
      console.error("Error adding module:", error);
    } finally {
      setIsLoadingAddModule(false);
    }
  };

  useEffect(() => {
    setPhase(1);
  }, []);

  const handlePickItem = (skill: PickItem) => {
    if (pickedItem?.id === skill?.id) return;

    handleRemoveSkill(pickedItem);

    setPickedItem(skill);

    setUserSettingsCareerGoal((prev) => {
      return {
        ...prev,
        skills: [skill.id, ...prev.skills],
        skillsObj: [skill, ...prev.skillsObj],
        skillsSuggest: prev.skillsSuggest.filter((s) => s.id !== skill.id),
      };
    });
  };

  const handleRemoveSkill = (skill: PickItem) => {
    if (!skill) return;

    setPickedItem(undefined);

    setUserSettingsCareerGoal((prev) => {
      const updatedSkills = prev.skills.filter((s) => s !== skill.id);
      const updatedSkillsObj = prev.skillsObj.filter(
        (sObj) => sObj.id !== skill.id
      );

      return {
        ...prev,
        skills: updatedSkills,
        skillsObj: updatedSkillsObj,
        skillsSuggest: [skill, ...prev.skillsSuggest],
      };
    });
  };
  return (
    <View style={styles.container}>
      {isLoadingAddModule && <CustomSpinner />}
      <Text style={styles.title}>{t("question_add_module")}</Text>
      <Text style={styles.description}>{t("description_add_module")}</Text>
      <View style={styles.pickedContainer}>
        {pickedItem ? (
          <View key={pickedItem.id} style={styles.pickedItem}>
            <Text style={styles.pickedItemText}>{pickedItem.name}</Text>
            <TouchableOpacity
              style={styles.pickedItemRemoveButton}
              onPress={() => handleRemoveSkill(pickedItem)}
            >
              <CancelIcon width={16} height={16} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.descriptionPicked}>
            <Text style={styles.descriptionPickedText}>{t("i_want_to")}</Text>
          </View>
        )}
      </View>
      <Text style={styles.descriptionListModule}>
        {t("description_list_module", {
          name: user?.group_obj?.name,
        })}
      </Text>

      <View style={[styles.listItemContainerItems, { flex: 1 }]}>
        {isLoading ? (
          <View
            style={[
              styles.loadingMoreSpinner,
              { marginTop: variables.scale(100) },
            ]}
          >
            <Spinner />
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {userSettingsCareerGoal?.skillsSuggest
              ?.filter(
                (skillSuggest) =>
                  !userSettingsCareerGoal?.skills?.some(
                    (skill) => skill === skillSuggest.id
                  )
              )
              .map((item) => (
                <View key={item.id.toString()} style={styles.pickedItem}>
                  <Text style={styles.pickedItemText}>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.pickedItemRemoveButton}
                    onPress={() => handlePickItem(item)}
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: variables.scale(40),
    flex: 1,
  },
  title: {
    fontFamily: commonColor.fontFamily,
    fontSize: variables.scale(32),
    lineHeight: variables.scale(60),
    fontWeight: "700",
  },
  description: {
    fontFamily: commonColor.fontFamily,
    fontSize: variables.scale(28),
    color: "#8C8C8C",
    lineHeight: variables.scale(60),
    fontWeight: "400",
  },
  pickedContainer: {
    marginTop: variables.scale(20),
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: variables.scale(10),
    padding: variables.scale(10),
  },
  descriptionPickedText: {
    marginVertical: variables.scale(35),
    marginHorizontal: variables.scale(50),
    fontFamily: commonColor.fontFamily,
    fontSize: variables.scale(28),
    color: "#8C8C8C",
    fontWeight: "400",
  },
  descriptionListModule: {
    marginTop: variables.scale(40),
    fontFamily: commonColor.fontFamily,
    fontSize: variables.scale(28),
    color: "#303E65",
    fontWeight: "400",
  },
  listItemContainerItems: {
    flex: 1,
    marginTop: variables.scale(20),
    borderTopWidth: 1,
    borderTopColor: "#F2F7FF",
  },
  listItem: {
    flex: 1,
  },
  pickedItem: {
    borderWidth: 1,
    borderColor: "#B3C0E0",
    backgroundColor: "#F5F5F7",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: variables.scale(10),
    paddingVertical: variables.scale(16),
    marginVertical: variables.scale(6),
    borderRadius: variables.scale(16),
    alignSelf: "flex-start",
  },
  pickedItemText: {
    fontSize: variables.scale(28),
    fontWeight: "600",
    color: "#303E65",
    flexShrink: 1,
  },
  pickedItemRemoveButton: {
    paddingHorizontal: variables.scale(20),
  },
  headerButtonText: {
    color: variables.colorPrimary,
    fontSize: variables.scale(28),
    fontWeight: "400",
  },
});

export default AddModule;
