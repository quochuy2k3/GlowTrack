import React, { useEffect, useState, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, XStack } from 'tamagui';
import { Navigation } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { useServices } from '@/services';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import useUserLocation from './useUserLocation';
import SunnyIcon from '@/assets/svgs/weather/SunnyIcon';
import MoonIcon from '@/assets/svgs/weather/MoonIcon';
import PartlyCloudyDayIcon from '@/assets/svgs/weather/PartlyCloudyDayIcon';
import PartlyCloudyNightIcon from '@/assets/svgs/weather/PartlyCloudyNightIcon';
import LightRainDayIcon from '@/assets/svgs/weather/LightRainDayIcon';
import LightRainNightIcon from '@/assets/svgs/weather/LightRainNightIcon';
import HeavyRainDayIcon from '@/assets/svgs/weather/HeavyRainDayIcon';
import HeavyRainNightIcon from '@/assets/svgs/weather/HeavyRainNightIcon';
import SnowyDayIcon from '@/assets/svgs/weather/SnowyDayIcon';
import SnowyNightIcon from '@/assets/svgs/weather/SnowyNightIcon';
import FogDayIcon from '@/assets/svgs/weather/FogDayIcon';
import FogNightIcon from '@/assets/svgs/weather/FogNightIcon';
import ThunderstormDayIcon from '@/assets/svgs/weather/ThunderstormDayIcon';
import ThunderstormNightIcon from '@/assets/svgs/weather/ThunderstormNightIcon';

const width = Dimensions.get('window').width;
const mockWeatherData = {
  // SUNNY DAY
  sunnyDay: {
    current: {
      is_day: true,
      condition: { code: 1000, text: 'Sunny' }, // Sunny condition code
      temp_c: 25,
      uv: 5,
    },
  },

  // LIGHT RAIN DAY
  lightRainDay: {
    current: {
      is_day: true,
      condition: { code: 1063, text: 'Light rain' }, // Light rain condition code
      temp_c: 20,
      uv: 3,
    },
  },

  // HEAVY RAIN DAY
  heavyRainDay: {
    current: {
      is_day: true,
      condition: { code: 1186, text: 'Heavy rain' }, // Heavy rain condition code
      temp_c: 18,
      uv: 1,
    },
  },

  // SNOWY DAY
  snowyDay: {
    current: {
      is_day: true,
      condition: { code: 1213, text: 'Snowy' }, // Snow condition code
      temp_c: -5,
      uv: 0,
    },
  },

  // FOGGY DAY
  foggyDay: {
    current: {
      is_day: true,
      condition: { code: 1135, text: 'Có mây' }, // Fog condition code
      temp_c: 10,
      uv: 2,
    },
  },

  // THUNDERSTORM DAY
  thunderstormDay: {
    current: {
      is_day: true,
      condition: { code: 1273, text: 'Thunderstorm' }, // Thunderstorm condition code
      temp_c: 22,
      uv: 4,
    },
  },

  // CLEAR NIGHT
  clearNight: {
    current: {
      is_day: false,
      condition: { code: 1000, text: 'Clear night' }, // Clear night condition code
      temp_c: 15,
      uv: 0,
    },
  },

  // LIGHT RAIN NIGHT
  lightRainNight: {
    current: {
      is_day: false,
      condition: { code: 1183, text: 'Light rain' }, // Light rain condition code
      temp_c: 16,
      uv: 0,
    },
  },

  // HEAVY RAIN NIGHT
  heavyRainNight: {
    current: {
      is_day: false,
      condition: { code: 1186, text: 'Heavy rain' }, // Heavy rain condition code
      temp_c: 14,
      uv: 0,
    },
  },

  // SNOWY NIGHT
  snowyNight: {
    current: {
      is_day: false,
      condition: { code: 1219, text: 'Snowy' }, // Snowy night condition code
      temp_c: -3,
      uv: 0,
    },
  },

  // FOGGY NIGHT
  foggyNight: {
    current: {
      is_day: false,
      condition: { code: 1147, text: 'Foggy' }, // Foggy condition code
      temp_c: 8,
      uv: 0,
    },
  },

  // THUNDERSTORM NIGHT
  thunderstormNight: {
    current: {
      is_day: false,
      condition: { code: 1279, text: 'Thunderstorm' }, // Thunderstorm condition code
      temp_c: 20,
      uv: 0,
    },
  },
};

export const WeatherFolder = React.memo(({ item, drag, isActive }: any) => {
  const { city, weatherData, errorMsg } = useUserLocation();
  const { t } = useTranslation();

  const backgroundColor = useMemo(() => {
    if (!weatherData?.current) return ['#FFFFFF', '#FFFFFF'];

    const { is_day, condition } = weatherData.current;
    const conditionCode = condition?.code;

    const dayConditions = new Set([
      1000, 1003, 1006, 1009, 1063, 1066, 1180, 1183, 1186, 1189, 1273, 1279, 1069,
    ]);
    const nightConditions = new Set([
      1000, 1003, 1006, 1009, 1063, 1066, 1180, 1183, 1186, 1189, 1273, 1279, 1069,
    ]);

    if (is_day) {
      // Morning bad weather conditions
      if (conditionCode === 1000) return ['rgb(218, 243, 246)', 'rgb(255, 222, 91)'];
      if (conditionCode === 1063 || conditionCode === 1066 || conditionCode === 1183)
        return ['#A9A9A9', '#D3D3D3']; // Light Rain / Light Snow
      if (conditionCode === 1186 || conditionCode === 1195) return ['#696969', '#808080']; // Heavy Rain / Thunderstorm
      if (conditionCode === 1213 || conditionCode === 1219) return ['#B0C4DE', '#4682B4']; // Snowy
      if (conditionCode === 1135 || conditionCode === 1147) return ['#708090', '#2F4F4F']; // Foggy
      return ['#B0E0E6', '#4682B4']; // Default for other bad weather conditions
    } else {
      // Night bad weather conditions
      if (conditionCode === 1000) return ['#2F4F4F', '#000000']; // Clear Night
      if (nightConditions.has(conditionCode)) return ['#2F2F4F', '#1C1C1C']; // Cloudy/Night
      if (conditionCode === 1183) return ['#708090', '#4682B4']; // Night Light Rain
      return ['#000000', '#191970']; // Default for other night conditions
    }
  }, [weatherData]);

  const textColor = useMemo(() => {
    return weatherData?.current?.is_day ? 'black' : 'white';
  }, [weatherData]);

  const getWeatherIcon = useMemo(() => {
    return (conditionCode: number, isDay: boolean) => {
      // console.log('conditionCode', conditionCode);
      // console.log('isDay', isDay);
      if (isDay) {
        if (conditionCode === 1000) return <SunnyIcon width={74} height={74} />;
        if (conditionCode === 1003) return <PartlyCloudyDayIcon width={74} height={74} />;
        if ([1063, 1066, 1183].includes(conditionCode))
          return <LightRainDayIcon width={74} height={74} />;
        if ([1186, 1195].includes(conditionCode))
          return <HeavyRainDayIcon width={74} height={74} />;
        if ([1213, 1219].includes(conditionCode)) return <SnowyDayIcon width={74} height={74} />;
        if ([1135, 1147].includes(conditionCode)) return <FogDayIcon width={74} height={74} />;
        return <ThunderstormDayIcon width={74} height={74} />;
      } else {
        if (conditionCode === 1000) return <MoonIcon width={60} height={60} />;
        if (conditionCode === 1003) return <PartlyCloudyNightIcon width={76} height={76} />;
        if (conditionCode === 1183) return <LightRainNightIcon width={74} height={74} />;
        if ([1186, 1195].includes(conditionCode))
          return <HeavyRainNightIcon width={74} height={74} />;
        if ([1213, 1219].includes(conditionCode)) return <SnowyNightIcon width={74} height={74} />;
        return <ThunderstormNightIcon width={74} height={74} />;
      }
    };
  }, []);

  return (
    <TouchableOpacity
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: variables.scale(12),
        elevation: 4,
        boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.07)',
        borderRadius: variables.scale(28),
      }}
      onLongPress={drag}
    >
      <LinearGradient
        colors={
          isActive
            ? [commonColor.ColorBackgroundGray97, commonColor.ColorBackgroundGray97]
            : backgroundColor
        }
        style={styles.folderContainer}
      >
        <Text style={[styles.titleText, { color: textColor }]}>{t('weather')}</Text>
        <XStack alignItems="center" gap="$2">
          <Text style={[styles.locationText, { color: textColor }]}>{t(city)}</Text>
          <Navigation size={12} color={textColor} />
        </XStack>

        {weatherData?.current && (
          <>
            <XStack mt="$3" alignItems="center" gap="$">
              {getWeatherIcon(weatherData.current.condition?.code, weatherData.current.is_day)}
              <YStack alignItems="center" gap="$1" flex={1} alignSelf="center">
                <Text style={[styles.temperatureText, { color: textColor }]}>
                  {weatherData.current.temp_c}°C
                </Text>
                <Text style={[styles.conditionText, { color: textColor }]}>
                  {weatherData.current.condition?.text}
                </Text>
              </YStack>
            </XStack>
            <XStack
              alignItems="flex-end"
              mt="$3"
              gap="$2"
              flex={1}
              justifyContent="space-between"
              px="$2"
            >
              <Text style={{ color: textColor }}>UV: {weatherData.current.uv}</Text>
              <Text style={{ color: textColor }}>Gió: {weatherData.current.wind_kph} km/h</Text>
            </XStack>
          </>
        )}

        {errorMsg && <Text style={{ color: textColor }}>{t(errorMsg)}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
});

WeatherFolder.displayName = 'WeatherFolder';

const styles = StyleSheet.create({
  folderContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: variables.scale(24),
    width: width / 2 - variables.scale(30),
    height: variables.scale(360),
    borderRadius: variables.scale(28),
  },
  titleText: {
    fontSize: variables.scale(32),
    fontFamily: commonColor.fontFamilyRobotoMedium,
    marginBottom: variables.scale(4),
  },
  locationText: {
    fontSize: variables.scale(26),
    fontFamily: commonColor.fontFamilyLight,
  },
  temperatureText: {
    fontSize: variables.scale(46),
    fontFamily: commonColor.fontFamilyMedium,
  },
  conditionText: {
    fontSize: variables.scale(32),
    fontFamily: commonColor.fontFamilySemiBold,
  },
});
