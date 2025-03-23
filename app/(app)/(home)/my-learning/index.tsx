import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { t } from "i18next";
import ProfileHeader from "@/components/ui/ProfileHeader/ProfileHeader";
import ListVideoCourse from "@/components/ui/ListVideoCourse";
import SetCareerGoal from "@/components/ui/setCareerGoal";
export default function MyLearningScreen() {
  const [CareerGoal, setCareerGoal] = useState(true);

  return (
    <ScrollView style={styles.container}>
      {CareerGoal ? (
        <>
          <ProfileHeader setCareerGoal={setCareerGoal} />
          <ListVideoCourse />
        </>
      ) : (
        <SetCareerGoal setCareerGoal={setCareerGoal} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
});
