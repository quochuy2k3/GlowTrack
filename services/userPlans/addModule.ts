import axios from "axios";
import utils from "@/utils";

export default async function addModule(
  name: string,
  skill: string
): Promise<any> {
  try {
    const response = await axios.post(`/lms/user-plans/module`, {
      name,
      skill,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("addModule___error", error);
    return {};
  }
}
