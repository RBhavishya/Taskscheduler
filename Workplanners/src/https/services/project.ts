import { ProjectData,UsersDropdownResponse, TaskResponse, GetAllProjectsParams, IAPIResponse} from "@/lib/interfaces/project";
import { $fetch } from "../fetch";

export const getAllProjectsAPI = async (queryParam: any) => {
  try {
    return await $fetch.get(`/projects?${queryParam}`);
  } catch (error) {
    throw error;
  }
};

export const getProjectByIdAPI = async (id: number) => {
  try {
    const response = await $fetch.get(`/projects/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createProjectAPI = async (newProject: ProjectData) => {
  try {
    const response = await $fetch.post(`/projects`, newProject);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProjectAPI = async (id: number, updatedProject: Partial<ProjectData>) => {
  try {
    const response = await $fetch.patch(`/projects/${id}`, updatedProject);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllUsersAPI = async (search: string = ""): Promise<UsersDropdownResponse> => {
  try {
    const response = await $fetch.get(`/users/dropdown?search_string=${encodeURIComponent(search)}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTasksByProjectId = async (projectId: number): Promise<TaskResponse> => {
  try {
    const response = await $fetch.get(`/projects/${projectId}/tasks`);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getProjectsForTable = async (params: GetAllProjectsParams): Promise<IAPIResponse> => {
  try {
    const query = new URLSearchParams({
      page: (params.page ?? 1).toString(),
      page_size: (params.page_size ?? 10).toString(),
      ...(params.order_by && { order_by: params.order_by }),
      ...(params.search_string && { search_string: params.search_string }),
    }).toString();
    return await $fetch.get(`/projects?${query}`);
  } catch (error) {
    throw new Error('Failed to fetch projects for table');
  }
};

export const deleteProjectForTable = async (projectId: number): Promise<void> => {
  try {
    await $fetch.delete(`/projects/${projectId}`);
  } catch (error) {
    throw new Error('Failed to delete project');
  }
};