import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Video, ResizeMode } from 'expo-av';

const VideoPlayer = ({ mode, videoType, isPlaying, videoId, setIsPlaying }: any) => {
  const videoRef = useRef(null);

  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let targetWidth = parentSize.width;
    let targetHeight;

    if (mode === 'fullScreen') {
      targetHeight = (targetWidth * 9) / 16;
    } else {
      targetHeight = (targetWidth * 9) / 16;
    }

    Animated.timing(animatedWidth, {
      toValue: targetWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedHeight, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [mode, parentSize]);

  return (
    <View
      style={styles.container}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setParentSize({ width, height });
      }}
    >
      <Animated.View
        style={[
          styles.videoContainer,
          {
            width: animatedWidth,
            height: animatedHeight,
          },
        ]}
      >
        {videoType === 'youtube' && (
          <YoutubePlayer
            ref={videoRef}
            width={parentSize.width}
            height={parentSize.height}
            play={isPlaying}
            videoId={videoId}
            onChangeState={event => {
              if (event === 'paused') {
                setIsPlaying(false);
              } else if (event === 'playing') {
                setIsPlaying(true);
              }
            }}
            initialPlayerParams={{
              allowsInlineMediaPlayback: true,
              showinfo: true,
              playsinline: true,
              modestbranding: false,
              controls: mode === 'fullScreen' ? true : false,
              rel: true,
            }}
          />
        )}
        {videoType === 'vimeo' && (
          <Video
            ref={videoRef}
            source={{
              uri: videoId || 'https://www.w3schools.com/html/mov_bbb.mp4',
            }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            shouldPlay={isPlaying}
            onPlaybackStatusUpdate={status => {
              if (status.didJustFinish || status.isPaused) {
                setIsPlaying(false);
              } else if (status.isPlaying) {
                setIsPlaying(true);
              }
            }}
            style={styles.video}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
});

export default VideoPlayer;
