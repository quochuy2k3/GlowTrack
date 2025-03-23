import { Widget } from "@/models";
import axios from "axios";

export default async function listWidgetsHome(
  codes: string[]
): Promise<Widget[]> {
  try {
    const response = await axios.get(`/lms/widgets/home`, {
      params: {
        codes: codes,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching widgets:", error);
    return [];
  }
}
