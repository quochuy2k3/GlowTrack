import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const WEATHER_API_KEY = '708b47fbcf8e4cb98f192659252803';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type WeatherData = {
  current: {
    is_day: boolean;
    temp_c: number;
    uv: number;
    wind_kph: number;
    condition: {
      code: number;
      text: string;
    };
  };
};

const useUserLocation = () => {
  const { t } = useTranslation();

  const [location, setLocation] = useState<Coordinates>({ latitude: 0, longitude: 0 });
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(t('permissionDenied'));
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const coords: Coordinates = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(coords);

      const geo = await Location.reverseGeocodeAsync(coords);

      if (geo && geo.length > 0) {
        const { city, region } = geo[0];
        const cityName = city || region || '';
        setCity(cityName);

        const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${coords.latitude},${coords.longitude}&lang=vi`;

        try {
          const res = await fetch(url);
          const json: WeatherData = await res.json();
          setWeatherData(json);
        } catch (error) {
          setErrorMsg('Lỗi lấy dữ liệu thời tiết');
          console.error('Weather API error:', error);
        }
      }
    })();
  }, []);

  return {
    location,
    city,
    weatherData,
    errorMsg,
  };
};

export default useUserLocation;
