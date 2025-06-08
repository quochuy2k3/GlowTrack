import { useState, useRef } from 'react';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';

export const useCameraCapture = () => {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const camRef = useRef<CameraView>(null);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (camRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
        mirror: facing === 'front',
      };

      const data = await camRef.current.takePictureAsync(options);
      return data;
    }
    return null;
  };

  return {
    facing,
    permission,
    requestPermission,
    camRef,
    toggleCameraFacing,
    takePicture,
  };
};
