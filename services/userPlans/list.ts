import axios from "axios";
import { UserPlan } from "./models/userPlan.model";

export default async function listUserPlans(): Promise<{
  modules: UserPlan[];
}> {
  try {
    const response = await axios.get(`/lms/user-plans`);
    return response?.data?.data;
  } catch (error) {
    console.error("listUserPlans___error", error);
    return { modules: [] };
  }
}
