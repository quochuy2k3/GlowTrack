import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { t } from 'i18next';
import VideoPlayer from './VideoPlayer';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import PlayVideoIcon from '@/assets/svgs/PlayVideoIcon';
import CancelVideoIcon from '@/assets/svgs/CancelVideoIcon';
import PauseVideoIcon from '@/assets/svgs/PauseVideoIcon';
import { Image } from 'tamagui';

export default function VideoContainer({
  mode,
  videoType,
  isPlaying,
  videoId,
  setIsPlaying,
  setMode,
  courseDetail,
  setIsLearning,
}: any) {
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const handleCancelVideo = () => {
    setIsLearning(false);
  };
  const fullStars = Math.floor(courseDetail?.avgRating);
  const hasHalfStar = courseDetail?.avgRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const allTypeVideo = ['youtube', 'vimeo'];
  return (
    <TouchableOpacity
      activeOpacity={mode === 'miniDock' ? 0 : 1}
      onPress={() => mode === 'miniDock' && setMode('fullScreen')}
      style={mode === 'miniDock' ? styles.containerMiniDock : styles.containerFullScreen}
    >
      <View style={mode === 'fullScreen' ? styles.videoContainer : { flex: 4 }}>
        {videoType && allTypeVideo.includes(videoType) ? (
          <VideoPlayer
            videoType={videoType}
            mode={mode}
            isPlaying={isPlaying}
            videoId={videoId}
            setIsPlaying={setIsPlaying}
          />
        ) : (
          <Image
            style={{ flex: 1 }}
            source={{
              uri: courseDetail?.coverImageUrl,
            }}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={mode === 'miniDock' ? styles.infoVideoContainer : { display: 'none' }}>
        <Text style={styles.videoCategoryText}>{courseDetail?.type && t(courseDetail.type)}</Text>
        <Text style={styles.videoTitleText}>{courseDetail?.title}</Text>
      </View>
      <View style={mode === 'miniDock' ? styles.buttonContainer : { display: 'none' }}>
        <TouchableOpacity style={styles.button} onPress={handlePlayPause}>
          {isPlaying ? (
            <PauseVideoIcon width={18} height={18} />
          ) : (
            <PlayVideoIcon width={18} height={18} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCancelVideo}>
          <CancelVideoIcon width={18} height={18} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerFullScreen: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  containerMiniDock: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    height: variables.scale(140),
  },
  infoVideoContainer: {
    flex: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: variables.scale(20),
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingRight: variables.scale(20),
  },
  button: {
    padding: variables.scale(15),
    marginRight: variables.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCategoryText: {
    fontSize: variables.scale(20),
    color: '#8C8C8C',
    fontWeight: '400',
    fontFamily: commonColor.fontFamily,
    lineHeight: variables.scale(24),
    marginBottom: variables.scale(5),
  },
  videoTitleText: {
    fontSize: variables.scale(24),
    color: '#000000',
    fontWeight: '700',
    fontFamily: commonColor.fontFamily,
    lineHeight: variables.scale(36),
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  informationCourseContainer: {
    paddingHorizontal: variables.scale(40),
    paddingVertical: variables.scale(20),
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleVideo: {
    fontSize: variables.scale(36),
    fontWeight: '700',
    fontFamily: commonColor.fontFamily,
    color: commonColor.black,
    marginBottom: variables.scale(20),
  },
  rateOfVideoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: variables.scale(34),
  },
  rateOfVideoText: {
    fontSize: variables.scale(28),
    fontWeight: '400',
    fontFamily: commonColor.fontFamily,
    color: commonColor.black,
    lineHeight: variables.scale(36),
  },
  numberOfRateOfVideoText: {
    fontSize: variables.scale(28),
    fontWeight: '400',
    fontFamily: commonColor.fontFamily,
    color: '#8C8C8C',
    lineHeight: variables.scale(36),
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: variables.scale(20),
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interactionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: variables.scale(60),
  },
  interactionText: {
    fontSize: variables.scale(32),
    fontWeight: '400',
    fontFamily: commonColor.fontFamily,
    color: commonColor.black,
    lineHeight: variables.scale(52),
    marginLeft: variables.scale(24),
  },
});
