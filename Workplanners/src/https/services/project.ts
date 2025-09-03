import { ProjectData,UsersDropdownResponse, TaskResponse} from "@/lib/interfaces/project";
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