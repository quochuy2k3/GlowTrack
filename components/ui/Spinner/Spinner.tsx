import { View } from "react-native";
import { Spinner } from "tamagui";
const CustomSpinner = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.7)",
        zIndex: 1,
      }}
    >
      <Spinner />
    </View>
  );
};

export default CustomSpinner;
