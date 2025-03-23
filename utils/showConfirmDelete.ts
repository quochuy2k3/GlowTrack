import { t } from "i18next";
import { Alert } from "react-native";

type AlertButtonConfig = {
  text: string;
  onPress?: () => void;
  style?: "cancel" | "destructive" | "default";
};

const showConfirmDelete = (
  title: string,
  message: string,
  confirmButton: AlertButtonConfig,
  cancelButton: AlertButtonConfig = {
    text: t("cancel").toUpperCase(),
    style: "cancel",
  }
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: confirmButton.text,
        onPress: confirmButton.onPress,
        style: confirmButton.style || "default",
      },
      {
        text: cancelButton.text,
        onPress: cancelButton.onPress,
        style: cancelButton.style || "cancel",
      },
    ],
    { cancelable: false }
  );
};

export default showConfirmDelete;
