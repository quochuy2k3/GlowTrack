import axios from "axios";
import utils from "@/utils";

export default async function listUserSetting(data: any): Promise<any> {
  try {
    const response = await axios.get(`/lms/user-settings`, {});
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}
