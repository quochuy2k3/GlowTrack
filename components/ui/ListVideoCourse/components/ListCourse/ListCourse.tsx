import { View } from "react-native";
import React, { useCallback } from "react";
import useFetchUserPlans from "@/hooks/useFetchUserPlans";
import CourseSection from "./CourseSection";
import { Spinner } from "tamagui";
import { useFocusEffect } from "expo-router";
import { UserPlan } from "@/services/userPlans/models/userPlan.model";

const ListCourse = () => {
  const { data: widgets, isLoading, refetch } = useFetchUserPlans();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <View style={{ backgroundColor: "#FAFAFA" }}>
      {widgets?.modules?.map((widget: UserPlan, widgetIndex: number) => (
        <CourseSection
          codeName={widget?.name}
          key={widgetIndex}
          widget={widget}
          isLoading={isLoading}
        />
      ))}
    </View>
  );
};

export default ListCourse;
