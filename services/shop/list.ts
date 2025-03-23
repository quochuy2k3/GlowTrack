import axios from "axios";
import utils from "@/utils";

export default async function listPositions(page: string): Promise<any> {
  try {
    const response = await axios.get(`/shop/api/v1/positions`, {
      params: {
        page: page,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching positions:", error);
    return []; // Return empty array on error
  }
}
