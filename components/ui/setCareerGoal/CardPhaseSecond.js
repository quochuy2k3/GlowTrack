import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import CheckIcon from "../../../assets/svgs/checkIcon";
import variables from "@/theme/commonColor";
import { useTranslation } from "react-i18next";

export default function CardPhaseSecond({ careerFocus, setCareerFocus }) {
  const { t } = useTranslation();
  const initData = [
    {
      title: t("grow_in_role"),
      description: t("description_grow_in_role"),
      logo: require("../../..//assets/images/artwork1.png"),
      key: "inRole",
    },
    {
      title: t("grow_beyond_role"),
      description: t("description_grow_beyond_role"),
      logo: require("../../..//assets/images/artwork2.png"),
      key: "beyondRole",
    },
    {
      title: t("open_to_both"),
      description: t("description_open_to_both"),
      logo: require("../../..//assets/images/artwork3.png"),
      key: "all",
    },
  ];
  const handleCheck = (item) => {
    setCareerFocus(item.key);
  };
  return (
    <View style={styles.container}>
      {initData.map((item, index) => (
        <View style={styles.card} key={index}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkboxButton,
                {
                  backgroundColor:
                    careerFocus === item.key ? "#1ECC78" : "#FFFFFF",
                },
              ]}
              onPress={() => handleCheck(item)}
            >
              {careerFocus === item.key ? (
                <CheckIcon style={styles.checkIcon} width={18} height={18} />
              ) : (
                <View style={styles.checkbox} />
              )}
            </TouchableOpacity>
          </View>
          <Image source={item.logo} style={styles.logo} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    marginTop: variables.scale(30),
  },
  card: {
    position: "relative",
    margin: variables.scale(30),
    height: variables.scale(540),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: variables.scale(10),
    borderWidth: 2,
    borderColor: "#EAECF0",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  logo: {
    marginBottom: variables.scale(60),
  },
  title: {
    fontSize: variables.scale(40),
    fontWeight: "700",
    color: "#000000",
    lineHeight: 20,
    marginBottom: variables.scale(20),
  },
  description: {
    width: variables.scale(370),
    fontSize: variables.scale(28),
    color: "#000000",
    textAlign: "center",
    lineHeight: 18,
  },
  checkboxContainer: {
    position: "absolute",
    top: variables.scale(30),
    right: variables.scale(30),
  },
  checkboxButton: {
    width: variables.scale(50),
    height: variables.scale(50),
    borderRadius: variables.scale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: variables.scale(50),
    height: variables.scale(50),
    borderRadius: variables.scale(10),
    borderWidth: 2,
    borderColor: "#1ECC78",
  },
  checkIcon: {
    color: "#1ECC78",
  },
});
