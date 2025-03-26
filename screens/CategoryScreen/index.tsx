import { useServices } from '@/services';
import React, { useState } from 'react';
import { SectionList, TouchableOpacity } from 'react-native';
import { useQuery, useInfiniteQuery } from 'react-query';
import { getToken, Spinner, Text, View, XStack } from 'tamagui';
import CategoryListItem from './components/CategoryListItem';
import { useTranslation } from 'react-i18next';
import { CircleChevronDown, CircleChevronLeft } from '@tamagui/lucide-icons';
import { useAuth } from '@/contexts/auth';
type SectionListData = {
  queryParam: string;
  title: string;
  count: number;
  data: {
    id: string;
    name: string;
    description: string;
  }[];
};

const CategoryScreen = () => {
  const services = useServices();
  const auth = useAuth();
  const { t } = useTranslation();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => services.CourseCategoryService.getUserTree(),
    enabled: auth.isAuthenticated,
  });

  const {
    data: skillsData,
    isLoading: isLoadingSkills,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['talent-skills'],
    queryFn: ({ pageParam = 1 }) => services.TalentSkillsService.getSkills({ page: pageParam }),
    getNextPageParam: lastPage => lastPage.meta.nextPage,
    enabled: auth.isAuthenticated,
  });

  if (auth.isLoading || isLoadingCategories || isLoadingSkills) {
    return <Spinner />;
  }

  const skillItems = skillsData?.pages.flatMap(page => page.items) || [];

  const sections = [
    {
      queryParam: 'courseCategories',
      title: t('category.Category'),
      count: categories?.length ?? 0,
      get data() {
        if (collapsedSections['courseCategories']) {
          return [];
        }
        return categories ?? [];
      },
    },
    {
      queryParam: 'skills',
      title: t('category.SkillEvaluations'),
      count: skillsData?.pages[0]?.meta.total ?? 0,
      get data() {
        if (collapsedSections['skills']) {
          return [];
        }
        return skillItems ?? [];
      },
    },
  ] as SectionListData[];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !collapsedSections['skills']) {
      fetchNextPage();
    }
  };

  return (
    <SectionList
      sections={sections}
      renderItem={({ item, section: { queryParam } }) => (
        <CategoryListItem queryParam={queryParam} item={item} />
      )}
      ItemSeparatorComponent={() => <View pt="$3" />}
      SectionSeparatorComponent={() => <View pt="$3" />}
      keyExtractor={item => item.id}
      renderSectionHeader={({ section }) => (
        <XStack py="$3" bg="$backgroundColor" justify="space-between" items="center">
          <Text fontSize="$5" fontWeight="bold">
            {section.title} ({section.count})
          </Text>
          <TouchableOpacity onPress={() => toggleSection(section.queryParam)} hitSlop={10}>
            <View p="$2">
              {collapsedSections[section.queryParam] ? (
                <CircleChevronLeft size={24} />
              ) : (
                <CircleChevronDown size={24} />
              )}
            </View>
          </TouchableOpacity>
        </XStack>
      )}
      style={{
        paddingHorizontal: getToken('$3', 'space'),
      }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
};

export default CategoryScreen;
