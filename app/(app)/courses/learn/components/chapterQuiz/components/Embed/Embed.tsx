import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import variables from "@/theme/commonColor";
import WebView from "react-native-webview";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Embed = ({
  contentDetail,
  courseId,
  onLoadData,
  setIsCanNextQuestion,
}: any) => {
  const [containerSize, setContainerSize] = useState({
    width: screenWidth,
    height: screenHeight,
  });

  useEffect(() => {
    const updateSize = () => {
      const width = screenWidth;
      const height = (width * 9) / 16;
      setContainerSize({ width, height });
    };

    updateSize();
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription?.remove?.();
  }, [containerSize.width, containerSize.height]);

  const onFinish = async () => {
    // try {
    //   const response = await LMS_API.submitQuestion(
    //     courseId,
    //     contentDetail?.content,
    //   );
    //   if (response) {
    //     onLoadData && onLoadData();
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
  };
  useEffect(() => {
    onFinish();
    setIsCanNextQuestion(true);
  }, []);

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerSize({ width, height });
      }}
    >
      <View
        style={[
          styles.videoContainer,
          {
            width: containerSize.width,
            height: containerSize.height,
          },
        ]}
      >
        <WebView
          style={styles.video}
          source={{
            uri: contentDetail?.contentObj?.sourceUrl,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: variables.scale(-40),
    justifyContent: "flex-start",
    alignItems: "center",
  },
  videoContainer: {
    width: "100%",
    height: "100%",
  },
  video: {
    flex: 1,
  },
});

export default Embed;
