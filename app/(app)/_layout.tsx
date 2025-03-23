import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/contexts/session";
import { t } from "i18next";
export default function AppLayout() {
  const { session, isLoading } = useSession();

  console.log("AppLayout", session, isLoading);

  // // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // // Only require authentication within the (app) group's layout as users
  // // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack>
      <Stack.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="courses"
        options={{
          title: "Courses",
        }}
      />
      <Stack.Screen
        name="courses/detail/[id]"
        options={{
          title: "Course Detail",
        }}
      />
      <Stack.Screen
        name="courses/learn/[id]"
        options={{
          title: t("course_title"),
        }}
      />
      <Stack.Screen
        name="list-courses"
        options={{
          title: "Minh Duy",
        }}
      />
      <Stack.Screen
        name="module/addModule"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="module/editModule"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="courses/addCourses"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="courses/deleteCourses"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
