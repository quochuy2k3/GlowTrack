import axios from "axios";
import utils from "@/utils";

export default async function deleteModule(module: string): Promise<any> {
  try {
    const response = await axios.delete(`/lms/user-plans/module`, {
      data: {
        module,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("deleteModule___error", error);
    return {};
  }
}
