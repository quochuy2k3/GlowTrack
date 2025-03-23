import { Course } from "@/models";
import { Meta } from "@/models/meta";
import axios from "axios";

export default async function listWidgetsHomeByCode(
  code: string,
  page?: number
): Promise<{
  items: Course[];
  meta: Meta;
}> {
  try {
    const response = await axios.get(`/lms/widgets/home/${code}/list`, {
      params: {
        code: code,
        page: page || 1,
      },
    });
    console.log("response.data.data", response?.data?.data);
    return response?.data?.data;
  } catch (error) {
    console.error("listWidgetsHomeByCode___error", error);
    return {
      items: [],
      meta: {
        total: 0,
        count: 0,
        per_page: 0,
        current_page: 0,
        total_pages: 0,
      },
    };
  }
}
