import { Course } from "@/models";
import { Meta } from "@/models/meta";
import axios from "axios";

export default async function getSectionCourse(
  id: string,
  page = 1,
  limit = 1000
): Promise<{ items: any[]; meta: Meta }> {
  try {
    const response = await axios.get(
      `lms/course-sections/?course=${id}&page=${page}&limit=${limit}`
    );
    return response?.data?.data;
  } catch (error) {
    return {} as { items: any[]; meta: Meta };
  }
}
