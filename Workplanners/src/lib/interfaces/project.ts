export interface User {
  id: number;
  name: string;
}

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


export interface CreateProjectResponse {
  success: boolean;
  status: number;
  data: ProjectData;
  message?: string;
}
export interface UsersDropdownResponse {
  status: number;
  success: boolean;
  data: {
    data: {
      pagination_info: {
        total_records: number;
        total_pages: number;
        page_size: number;
        current_page: number;
        next_page: number | null;
        prev_page: number | null;
      };
      records: Array<{
        id: number;
        display_name: string;
      }>;
    };
  };
}

export interface IAPIResponse {
  data: {
    records: ProjectData[];
    pagination_info: {
      total_records: number;
      total_pages: number;
      page_size: number;
      current_page: number;
    };
  };
  success: boolean;
  message?: string;
}
export interface GetAllProjectsParams {
  order_by?: string;
  page?: number;
  page_size?: number;
  search_string?: string;
}





