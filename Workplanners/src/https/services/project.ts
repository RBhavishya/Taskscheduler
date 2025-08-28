import { ProjectData } from "@/lib/interfaces/project";
import { $fetch } from "../fetch";

export const getAllProjectsAPI = async () => {
  try {
    const response = await $fetch.get(`/projects`);
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
    const response = await $fetch.get(`/users`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const checkProjectTitleAPI = async (title: string) => {
  try {
    const response = await $fetch.get(`/projects`);
    const projects = response.data?.records || [];
    return projects.some((p: ProjectData) => p.title.toLowerCase() === title.toLowerCase());
  } catch (error) {
    throw error;
  }
};