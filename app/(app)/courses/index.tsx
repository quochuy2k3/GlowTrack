import { useRouter } from "expo-router";
import { Card, H6, Paragraph, Spinner, YStack } from "tamagui";
import { useQuery } from "react-query";
import { useService } from "@/services";

export default function CoursesScreen() {
  const service = useService();

  const { data: courses, isLoading } = useQuery({
    queryKey: "courses",
    queryFn: service.courses.list,
  });

  return (
    <YStack p="$5" gap="$3">
      {isLoading && <Spinner />}
      {courses?.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          description={course.description}
        />
      ))}
    </YStack>
  );
}

function CourseCard({
  id,
  title,
  description,
}: {
  id: number;
  title: string;
  description: string;
}) {
  const router = useRouter();

  return (
    <Card
      animation="superBouncy"
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      onPress={() =>
        router.push({
          pathname: "/courses/detail/[id]",
          params: { id, name: title },
        })
      }
    >
      <Card.Header>
        <H6>{title}</H6>
      </Card.Header>
      <Card.Footer />
      <YStack p="$4">
        <Paragraph>{description}</Paragraph>
      </YStack>
    </Card>
  );
}
