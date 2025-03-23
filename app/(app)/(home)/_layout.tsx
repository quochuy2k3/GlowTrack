import TabBarIcon from "@/components/ui/TabBarIcon";
import { Tabs } from "expo-router";
import { Image } from "tamagui";
import variables from "@/theme/commonColor";
import { t } from "i18next";

export default function Layout() {
  return (
    <Tabs screenOptions={{
      tabBarLabelStyle: {
        textAlign: 'center',
        fontSize:variables.scale(20),
        fontWeight:'400'
      },
      tabBarInactiveTintColor: variables.colorSecondaryLight
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title'),
          tabBarIcon: ({ focused }) => (
            <Image
              width={24}
              height={24}
              source={
                focused 
                  ? require("@/assets/images/home/HomeActive.png") 
                  : require("@/assets/images/home/Home.png")
              }
              tintColor={focused ? undefined : variables.colorSecondaryLight}
            />
          ),

        }}
      />
      <Tabs.Screen
        name="my-learning"
        options={{
          title: t("myLearning.title"),
          tabBarIcon: ({ focused }) => (
            <Image 
              width={24}
              height={24}
              source={
                focused ? require("@/assets/images/myLearningActive.png") : require("@/assets/images/myLearning.png")
              }
              tintColor={focused ? undefined : variables.colorSecondaryLight}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t("library.title"),
          tabBarIcon: ({ focused }) => (
            <Image 
              width={24}
              height={24}
              source={
                focused ? require("@/assets/images/myLibraryActive.png") : require("@/assets/images/myLibrary.png")
              }
              tintColor={focused ? undefined : variables.colorSecondaryLight}
            />
          ),
          
        }}
      />
      <Tabs.Screen
        name="category"
          options={{
            title: t("category.title"),
          tabBarIcon: ({ focused }) => (
            <Image 
              width={24}
              height={24}
              source={
                focused ? require("@/assets/images/myCategoryActive.png") : require("@/assets/images/myCategory.png")
              }
              tintColor={focused ? undefined : variables.colorSecondaryLight}
            />
          ),
        }}
      />
    </Tabs>
  );
}
