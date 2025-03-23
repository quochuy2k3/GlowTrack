import { SkillResponse } from "./models/skill";
import axios from "axios";

export default async function listSkills(page: string): Promise<SkillResponse> {
  try {
    const response = await axios.get(`/talent-management/api/v1/skills`, {
      params: {
        page: page,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return {
      items: [],
      meta: {
        current_page: 1,
        total: 0,
        per_page: 10,
        count: 0,
        total_pages: 0,
      },
    };
  }
}
