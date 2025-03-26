import { Text } from 'tamagui';
import { StyledCard } from './styled';
import { memo } from 'react';
import { router } from 'expo-router';

interface CategoryListItemProps {
  queryParam: string;
  item: {
    id: string;
    name: string;
  };
}

function CategoryListItem({ queryParam, item }: CategoryListItemProps) {
  const _onPress = () => {
    router.push({
      pathname: '/courses',
      params: {
        screenTitle: item.name,
        [queryParam]: item.id,
      },
    });
  };

  return (
    <StyledCard onPress={_onPress}>
      <Text fontSize="$6">{item.name}</Text>
    </StyledCard>
  );
}

export default memo(CategoryListItem);
