export interface ProjectData {
  id?: number;
  title: string;
  description?: string;
  status?: string;
  created_by: string | number;
  updated_by?: string | number;
  start_date?: string;
  due_date?: string;
  links?: string[];
  assigned_users?: number[];
}

export interface User {
  id: number;
  name: string;
}