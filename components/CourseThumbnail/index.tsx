import React, { ComponentProps } from 'react';
import { styled } from '@tamagui/core';
import { Image } from 'tamagui';

export const StyledImage = styled(Image, {
  width: '100%',
  objectFit: 'cover',
});

type StyledImageProps = ComponentProps<typeof StyledImage>;

export type CourseThumbnailProps = StyledImageProps & {
  height: StyledImageProps['height'];
  url?: string;
};

export default function CourseThumbnail({ url, ...props }: CourseThumbnailProps) {
  return (
    <StyledImage
      {...props}
      src={
        url
          ? { uri: url }
          : require('@/assets/images/tanca_elearning_logo.e92fad6a61c7388e4df6.jpg')
      }
    />
  );
}
