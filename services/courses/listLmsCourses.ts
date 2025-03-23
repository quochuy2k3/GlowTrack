import { Course } from "@/models";
import { Meta } from "@/models/meta";
import axios from "axios";
import utils from "@/utils";

export default async function listLmsCourses(
  page: number,
  title = ""
): Promise<{ items: Course[]; meta: Meta }> {
  try {
    const response = await axios.get(`/lms/courses`, {
      params: {
        page,
        title,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("listLmsCourses___error", error);
    return {
      items: [],
      meta: {
        total: 0,
        count: 0,
        per_page: 10,
        current_page: 1,
        total_pages: 0,
      },
    };
  }
}
