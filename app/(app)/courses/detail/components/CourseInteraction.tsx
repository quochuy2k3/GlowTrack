import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import commonColor from "@/theme/commonColor";
import variables from "@/theme/commonColor";
import StarOfRate from "@/assets/svgs/StarOfRate";
import NonStarOfRate from "@/assets/svgs/NonStarOfRate";
import LikeIcon from "@/assets/svgs/LikeIcon";
import DislikeIcon from "@/assets/svgs/DislikeIcon";
import ShareIcon from "@/assets/svgs/ShareIcon";
import { t } from "i18next";

import FastImage from "react-native-fast-image";
import { Image } from "react-native";
const CourseInteraction = ({ courseDetail, loading }: any) => {
  const fullStars = Math.floor(courseDetail?.avgRating);
  const hasHalfStar = courseDetail?.avgRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <View style={styles.containerFullScreen}>
      <View style={styles.videoContainer}>
        {courseDetail?.coverImageUrl ? (
          <Image
            style={{ flex: 1 }}
            source={{
              uri: courseDetail?.coverImageUrl,
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("@/assets/images/tanca_elearning_logo.e92fad6a61c7388e4df6.jpg")}
              style={{ flex: 1 }}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      <View style={styles.informationCourseContainer}>
        <Text style={styles.titleVideo}>{courseDetail?.title}</Text>
        <View style={styles.rateOfVideoContainer}>
          <Text style={styles.rateOfVideoText}>
            {courseDetail?.avgRating?.toFixed(1)}
          </Text>
          <View style={styles.starContainer}>
            {Array.from({ length: fullStars }).map((_, index) => (
              <StarOfRate
                key={`full-${index}`}
                width={variables.scale(40)}
                height={variables.scale(40)}
              />
            ))}

            {hasHalfStar && (
              <StarOfRate
                key="half"
                width={variables.scale(40)}
                height={variables.scale(40)}
              />
            )}

            {Array.from({ length: emptyStars }).map((_, index) => (
              <NonStarOfRate
                key={`empty-${index}`}
                width={variables.scale(40)}
                height={variables.scale(40)}
              />
            ))}
          </View>
          {courseDetail?.totalRatings ? (
            <Text style={styles.numberOfRateOfVideoText}>
              {`(${courseDetail?.totalRatings})`}
            </Text>
          ) : null}
        </View>
        {/* <View style={styles.interactionContainer}>
          <TouchableOpacity style={styles.interactionButton}>
            <LikeIcon
              width={variables.scale(40)}
              height={variables.scale(40)}
            />
            <Text style={styles.interactionText}>123</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionButton}>
            <DislikeIcon
              width={variables.scale(40)}
              height={variables.scale(40)}
            />
            <Text style={styles.interactionText}>123</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionButton}>
            <ShareIcon
              width={variables.scale(40)}
              height={variables.scale(40)}
            />
            <Text style={styles.interactionText}>
              {intl.formatMessage(Messages.share)}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFullScreen: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },
  infoVideoContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: variables.scale(20),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: variables.scale(20),
  },
  button: {
    padding: variables.scale(15),
    marginRight: variables.scale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  videoCategoryText: {
    fontSize: variables.scale(20),
    color: "#8C8C8C",
    fontWeight: "400",
    fontFamily: commonColor.fontFamily,
    lineHeight: variables.scale(24),
    marginBottom: variables.scale(5),
  },
  videoTitleText: {
    fontSize: variables.scale(24),
    color: "#000000",
    fontWeight: "700",
    fontFamily: commonColor.fontFamily,
    lineHeight: variables.scale(36),
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 8 / 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  informationCourseContainer: {
    paddingHorizontal: variables.scale(20),
    paddingVertical: variables.scale(20),
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexShrink: 1,
  },

  titleVideo: {
    fontSize: variables.scale(30),
    fontWeight: "700",
    fontFamily: commonColor.fontFamily,
    color: "#000000",
    marginBottom: variables.scale(20),
  },
  rateOfVideoContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rateOfVideoText: {
    fontSize: variables.scale(28),
    fontWeight: "400",
    fontFamily: commonColor.fontFamily,
    color: "#000000",
    lineHeight: variables.scale(36),
  },
  numberOfRateOfVideoText: {
    fontSize: variables.scale(28),
    fontWeight: "400",
    fontFamily: commonColor.fontFamily,
    color: "#8C8C8C",
    lineHeight: variables.scale(36),
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: variables.scale(20),
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: variables.scale(34),
  },
  interactionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: variables.scale(60),
  },
  interactionText: {
    fontSize: variables.scale(32),
    fontWeight: "400",
    fontFamily: commonColor.fontFamily,
    color: "#000000",
    lineHeight: variables.scale(52),
    marginLeft: variables.scale(24),
  },
});
export default CourseInteraction;
