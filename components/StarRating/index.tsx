import { Star, StarHalf } from '@tamagui/lucide-icons';
import { Text, View, XStack, useTheme } from 'tamagui';

type StarRatingProps = {
  rating?: number;
  totalRatings?: number;
};

const totalStars = 5;

export default function StarRating({ rating = 0, totalRatings }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
  const theme = useTheme();

  return (
    <XStack gap="$1" items="center">
      <Text mr="$2">{rating.toFixed(1)}</Text>
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} color={theme.yellow10} fill={theme.yellow10.get()} size="$1" />
      ))}

      {hasHalfStar && (
        <View position="relative">
          <StarHalf color={theme.yellow10} fill={theme.yellow10.get()} size="$1" />
          <Star color={theme.yellow10} position="absolute" t={0} l={0} size="$1" />
        </View>
      )}

      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={`empty-${index}`} color={theme.yellow10} size="$1" />
      ))}

      {totalRatings !== undefined && <Text ml="$2">{`(${totalRatings})`}</Text>}
    </XStack>
  );
}
