import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import CheckIcon from "@src/assets/svg/eLearning/checkIcon";
import variables from "@/theme/commonColor";

interface CardPhaseSecondProps {
  careerFocus: string;
  setCareerFocus: (key: string) => void;
}

interface CardData {
  title: string;
  description: string;
  logo: any;
  key: string;
}

export default function CardPhaseSecond({
  careerFocus,
  setCareerFocus,
}: CardPhaseSecondProps) {
  const initData: CardData[] = [
    {
      title: "Grow in Role",
      description: "Deepen your knowledge and expertise in your role",
      logo: require("@src/assets/images/elearning/artwork1.png"),
      key: "inRole",
    },
    {
      title: "Grow Beyond Role",
      description: "Stretch your potential in other roles and/or industries",
      logo: require("@src/assets/images/elearning/artwork2.png"),
      key: "beyondRole",
    },
    {
      title: "Open to Both",
      description: "You're not certain how you want to grow just yet",
      logo: require("@src/assets/images/elearning/artwork3.png"),
      key: "all",
    },
  ];

  const handleCheck = (item: CardData): void => {
    setCareerFocus(item.key);
  };

  return (
    <View style={styles.container}>
      {initData.map((item, index) => (
        <View key={index} style={styles.card}>
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
