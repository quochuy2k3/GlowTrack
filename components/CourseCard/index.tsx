import { CourseCardProps } from './types';
import HomeWidgetCourseCard from './HomeWidgetCourseCard';
import ProgressCourseCard from './ProgressCourseCard';
import ListItemCourseCard from './ListItemCourseCard';
import { useRouter } from 'expo-router';
import RelatedListItemCourseCard from './RelatedListItemCourseCard';

export default function CourseCard(props: CourseCardProps) {
  const router = useRouter();

  const _onPress = () => {
    if (props.onPress) {
      props.onPress();
      return;
    }

    router.push({
      pathname: '/courses/detail/[id]',
      params: { id: props.course.id, title: props.course.title },
    });
  };

  if (props.variant === 'progress') {
    return <ProgressCourseCard {...props} onPress={_onPress} />;
  }

  if (props.variant === 'list-item') {
    return <ListItemCourseCard {...props} onPress={_onPress} />;
  }

  if (props.variant === 'related-list-item') {
    return <RelatedListItemCourseCard {...props} onPress={_onPress} />;
  }

  return <HomeWidgetCourseCard {...props} onPress={_onPress} />;
}
