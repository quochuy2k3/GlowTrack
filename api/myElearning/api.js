import { mockCareerGoalsData } from "./mockData";

const LMS_API = {
  getTalentSkills: async (page = 1) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock data with pagination
    return {
      items: mockCareerGoalsData.items,
      meta: {
        ...mockCareerGoalsData.meta,
        current_page: page,
        total_pages: Math.ceil(
          mockCareerGoalsData.meta.total / mockCareerGoalsData.meta.per_page
        ),
      },
    };
  },

  getJobInterests: async (page = 1) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock data with pagination
    return {
      items: mockCareerGoalsData.items.filter((item) => item.is_used),
      meta: {
        ...mockCareerGoalsData.meta,
        current_page: page,
        total_pages: Math.ceil(
          mockCareerGoalsData.meta.total / mockCareerGoalsData.meta.per_page
        ),
      },
    };
  },

  getUserSettingsCareerGoal: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock user settings
    return {
      skills: [],
      skillsObj: [],
      careerFocus: "",
      rolesInterested: [],
      rolesInterestedObj: [],
    };
  },

  putUserSettingsCareerGoal: async (data) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return success response
    return {
      success: true,
      data: data,
    };
  },
};

export default LMS_API;
