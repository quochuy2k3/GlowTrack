import React from 'react';
import CourseThumbnail, { CourseThumbnailProps } from '@/components/CourseThumbnail';

export function ThumbnailImage({ url, ...props }: CourseThumbnailProps) {
  return <CourseThumbnail url={url} {...props} rounded="$2" />;
}
