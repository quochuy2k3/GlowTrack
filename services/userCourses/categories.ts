import axios from "axios";

export default async function categories(page: number = 1): Promise<any> {
  try {
    const response = await axios.get(
      `lms/user-course-categories/tree?page=${page}`
    );
    return response?.data?.data;
  } catch (error) {
    return {} as any;
  }
}
