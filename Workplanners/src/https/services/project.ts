import { ProjectData } from "@/lib/interfaces/project";
import { $fetch } from "../fetch";

export const getAllProjectsAPI = async () => {
  try {
    const response = await $fetch.get(`/projects`);
     console.log(response);
    return response;
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

export const getAllUsersAPI = async () => {
  try {
    const response = await $fetch.get(`/users/dropdown`);
    return response;
  } catch (error) {
    throw error;
  }
};