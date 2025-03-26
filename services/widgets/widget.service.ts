import type { ListResponse, PaginatedListResponse } from '@/models/base';
import lmsAPI from '../config/axios';
import { HomeWidget, HomeWidgetData, HomeWidgetDataDTO, HomeWidgetDTO } from '@/models/widget';
import { transformPaginatedList } from '@/utils/pagination';

function transformHomeWidgetData(data: HomeWidgetData): HomeWidgetDataDTO {
  return {
    ...data,
    progress: Math.round((data.totalLearnedContents / data.totalContents) * 100),
  };
}

function transformHomeWidget(data: HomeWidget): HomeWidgetDTO {
  return {
    ...data,
    dataObj: data.dataObj.map(transformHomeWidgetData),
  };
}

/**
 * Widget Services
 */
export const WidgetService = {
  /**
   * Get all widgets in home
   * @param codes Array of widget codes to retrieve
   */
  findHome: async (codes: string[]) => {
    const response = await lmsAPI.get<{ widgets: HomeWidget[] }>('/widgets/home', {
      params: { codes },
    });
    return response.data.widgets.map(transformHomeWidget);
  },

  /**
   * Get list of courses by widget code
   * @param code Widget code
   * @param params Query parameters for filtering and pagination
   */
  getDataByCode: async (
    code: string,
    params?: {
      page?: number;
      limit?: number;
      sort?: string[];
      courseCategory?: string;
    }
  ) => {
    const response = await lmsAPI.get<PaginatedListResponse<HomeWidgetData>>(
      `/widgets/home/${code}/list`,
      { params }
    );

    return transformPaginatedList(response.data, transformHomeWidgetData);
  },

  /**
   * Find courses with filters
   * @param params Query parameters for filtering and pagination
   */
  findCourses: async (params?: {
    page?: number;
    limit?: number;
    sort?: string[];
    title?: string;
    courseCategories?: string;
    skills?: string;
  }) => {
    const response = await lmsAPI.get<PaginatedListResponse<HomeWidgetData>>('/widgets/course', {
      params,
    });
    return transformPaginatedList(response.data, transformHomeWidgetData);
  },

  /**
   * Get related courses for a specific course
   * @param courseId Course ID to find related courses for
   */
  getRelatedCourse: async (courseId: string) => {
    const response = await lmsAPI.get<ListResponse<HomeWidgetData>>(
      `/widgets/course/${courseId}/related`
    );

    return response.data.items.map(transformHomeWidgetData);
  },
};
