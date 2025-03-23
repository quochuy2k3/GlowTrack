import { Course } from "@/models";
import list from "./list";

export default async function getCourseSection(id: string): Promise<any> {
  if (!id) {
    throw new Error("Course not found");
  }

  const tempData = {
    items: [
      {
        id: "6788b55d3ba31f26466e1128",
        name: "Part 1",
        description: "",
        color: "#989A9B",
        position: 1,
      },
      {
        id: "6788b5683ba31f26466e112c",
        name: "Part 2",
        description: "",
        color: "#989A9B",
        position: 2,
      },
      {
        id: "67b40faf32eaab9a15c61d2f",
        name: "Section 3",
        description: "",
        color: "#E8384F",
        position: 3,
      },
    ],
  };
  return tempData;
}
