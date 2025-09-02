import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllProjectsAPI, getProjectByIdAPI } from "@/https/services/project";
import { ProjectData } from "@/lib/interfaces/project";
import { useNavigate } from "@tanstack/react-router";
import { Pagination } from "../core/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, Filter, LayoutGrid, List } from "lucide-react";
import Tanstacktable from "src/components/core/Tanstacktable";
const Projects = () => {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("New");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-GB");
  const formattedDate = time.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  //  Fetch all projects
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects", page, pageSize, search, sortBy],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (pageSize) queryParams.append("page_size", pageSize.toString());
      if (search) queryParams.append("search_string", search);
      if (sortBy) queryParams.append("sort_by", sortBy.toLowerCase());

      const result = await getAllProjectsAPI(queryParams.toString());
      return result;
    },
    retry: 3,
    refetchOnMount: true,
  });

  //  Fetch single project
  const {
    data: selectedProjectData,
    isLoading: loadingProject,
    isError: errorProject,
    error: projectError,
  } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const result = await getProjectByIdAPI(selectedProjectId!);
      return result;
    },
    enabled: !!selectedProjectId,
  });

  const existingProjects: ProjectData[] =
    data?.data?.data?.records && Array.isArray(data.data.data.records)
      ? data.data.data.records
      : [];

  const paginationDetails = {
    total_records: data?.data?.data?.pagination_info?.total_records || 0,
    total_pages: data?.data?.data?.pagination_info?.total_pages || 1,
    current_page: data?.data?.data?.pagination_info?.current_page || 1,
    page_size: data?.data?.data?.pagination_info?.page_size || pageSize,
    next_page: data?.data?.data?.pagination_info?.next_page || null,
    prev_page: data?.data?.data?.pagination_info?.prev_page || null,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    console.error("Query Error:", error);
    return (
      <p className="text-red-500">
        Error fetching projects: {error?.message || "Unknown error"}
      </p>
    );
  }

  const handleNavigation = () => navigate({ to: `/projects/add` });
  const handleView = (id: number) => navigate({ to: `/projects/view/${id}` });

  return (
    <div className="w-full p-4">
      {/* Top Bar (Timer) */}
      <div className="flex items-center mb-6 w-full">
        <div className="h-10 w-px bg-gray-300 mx-6"></div>
        <div className="flex flex-col justify-around w-1/4">
          <span className="text-lg font-semibold">{formattedTime}</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>

      <div className="w-full h-7 border-t border-gray-200"></div>

      {/* Title & Controls */}
      <div className="flex items-center justify-between mb-7 px-4">
        <h2 className="font-bold text-2xl">Projects</h2>
        <div className="flex items-center gap-3 flex-1 justify-end">
          {/* Search */}
          <input
            type="text"
            placeholder="Search project..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded-lg w-1/4"
          />

          {/* Sort By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 border px-4 py-2 rounded-lg">
                <Filter className="text-purple-500" size={18} />
                Sort by
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["New", "In Progress", "Review", "Overdue", "Done"].map(
                (option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setSortBy(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <div className="flex items-center gap-2 px-1 py-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid" ? "bg-purple-100 text-purple-600" : ""
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg ${
                viewMode === "table" ? "bg-purple-100 text-purple-600" : ""
              }`}
            >
              <List size={18} />
            </button>
          </div>

          {/* New Project Button */}
          <button
            onClick={handleNavigation}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer"
          >
            + New Project
          </button>
        </div>
      </div>

      <hr className="mb-4" />

      {/* Projects Section */}
      <div className="flex gap-6 pb-24">
        {viewMode === "grid" ? (
          <>
            {/* Left side - Project Cards */}
            <div className="w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {existingProjects.length === 0 ? (
                <p className="text-gray-500 col-span-3 text-center py-6">
                  No projects available.
                </p>
              ) : (
                existingProjects.map((project: ProjectData) => (
                  <Card
                    key={project.id}
                    className="w-[212px] h-[212px] shadow-lg rounded-2xl hover:shadow-xl relative flex flex-col justify-center items-center cursor-pointer"
                    onClick={() => {
                      setSelectedProjectId(project.id ?? null);
                      setShowDetails(false);
                    }}
                  >
                    {/* 3-dots menu */}
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <MoreVertical size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({ to: `/projects/edit/${project.id}` })
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              console.log("Delete project", project.id)
                            }
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Card Content */}
                    <CardContent className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                        {project.title?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <h2 className="text-lg font-semibold break-words text-center px-2">
                        {project.title || "Untitled"}
                      </h2>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="w-1/3 bg-gray-50 p-6 rounded-xl shadow-inner">
              {!selectedProjectId ? (
                <p className="text-gray-500">
                  Select a project to view details
                </p>
              ) : loadingProject ? (
                <p>Loading project details...</p>
              ) : errorProject ? (
                <p className="text-red-500">
                  Error loading project:{" "}
                  {projectError?.message || "Unknown error"}
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500 text-white font-bold text-2xl flex items-center justify-center">
                      {selectedProjectData?.data?.data?.title
                        ?.charAt(0)
                        .toUpperCase() || ""}
                    </div>
                    <h2 className="text-2xl font-bold truncate max-w-[15ch]">
                      {selectedProjectData?.data?.data?.title || "Unknown"}
                    </h2>
                  </div>
                  <button
                    onClick={() => handleView(selectedProjectId!)}
                    className="px-7 py-1 rounded-full border border-gray-400 text-gray-600 mb-6"
                  >
                    View
                  </button>
                  <h2 className="font-semibold text-xl mb-2">About Project</h2>
                  <p className="text-gray-600">
                    {selectedProjectData?.data?.data?.description ||
                      "No Description"}
                  </p>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="w-full">
            <Tanstacktable />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        className="pb-4 px-4"
        style={{
          position: "fixed",
          bottom: 0,
        }}
      >
        <Pagination
          paginationDetails={paginationDetails}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
};

export default Projects;
