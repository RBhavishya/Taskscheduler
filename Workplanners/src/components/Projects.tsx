import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllProjectsAPI, getProjectByIdAPI } from "@/https/services/project";
import { ProjectData } from "@/lib/interfaces/project";
import { useNavigate } from "@tanstack/react-router";

const Projects = () => {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const result = await getAllProjectsAPI();
      return result;
    },
    retry: 3,
    refetchOnMount: true,
  });

  const {
    data: selectedProjectData,
    isLoading: loadingProject,
    isError: errorProject,
    error: projectError,
  } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const result = await getProjectByIdAPI(selectedProjectId!);
      console.log("Project by ID API response:", JSON.stringify(result, null, 2));
      return result;
    },
    enabled: !!selectedProjectId,
  });

  const existingProjects: ProjectData[] =
    data?.data?.data?.records && Array.isArray(data.data.data.records)
      ? data.data.data.records
      : [];
  const filteredProjects: ProjectData[] = existingProjects.filter(
    (p: ProjectData) => p.title?.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleNavigation = () => {
    navigate({ to: "/projects/add" });
  };

  return (
    <div className="w-full">
      {/* Top Bar */}
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
          <input
            type="text"
            placeholder="Search project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg w-1/3"
          />
          <button
            onClick={() => handleNavigation()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            + New Project
          </button>
        </div>
      </div>
      <hr className="mb-4" />

      {/* Projects */}
      <div className="flex gap-6">
        <div className="w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center py-6">
              No projects available.
            </p>
          ) : (
            filteredProjects.map((project: ProjectData) => (
              <Card
                key={project.id}
                className="p-4 shadow-lg rounded-2xl hover:shadow-xl cursor-pointer"
                onClick={() => {
                  console.log("Selecting Project ID:", project.id);
                  setSelectedProjectId(project.id ?? null);
                  setShowDetails(false);
                }}
              >
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                      {project.title?.charAt(0).toUpperCase() || ""}
                    </div>
                    <h2 className="text-lg font-semibold">
                      {project.title || "Untitled"}
                    </h2>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Project Details */}
        <div className="w-1/3 bg-gray-50 p-6 rounded-xl shadow-inner">
          {!selectedProjectId ? (
            <p className="text-gray-500">Select a project to view details</p>
          ) : loadingProject ? (
            <p>Loading project details...</p>
          ) : errorProject ? (
            <p className="text-red-500">
              Error loading project: {projectError?.message || "Unknown error"}
            </p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500 text-white font-bold text-2xl flex items-center justify-center">
                  {selectedProjectData?.data?.data?.title
                    ?.charAt(0)
                    .toUpperCase() || ""}
                </div>
                <h2 className="text-2xl font-bold">
                  {selectedProjectData?.data?.data?.title || "Unknown"}
                </h2>
              </div>
              <h2 className="flex items-center justify-center text-semibold text-2xl">
                About
              </h2>
              <p className="flex items-center justify-center mb-4 text-gray-600">
                {selectedProjectData?.data?.data?.description ||
                  "No Description"}
              </p>

              <button
                onClick={() => setShowDetails((prev) => !prev)}
                className="px-3 py-2 mb-4 bg-purple-600 text-white rounded-lg"
              >
                {showDetails ? "Hide Details" : "View"}
              </button>

              {showDetails && (
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedProjectData?.data?.data?.project_status || "NA"}
                  </p>
                  <p>
                    <strong>Created By:</strong>{" "}
                    {selectedProjectData?.data?.data?.created_by || "NA"}
                  </p>
                  <p>
                    <strong>Updated By:</strong>{" "}
                    {selectedProjectData?.data?.data?.updated_by || "NA"}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {selectedProjectData?.data?.data?.start_date || "NA"}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {selectedProjectData?.data?.data?.due_date || "NA"}
                  </p>
                  <p>
                    <strong>Links:</strong>{" "}
                    {Array.isArray(selectedProjectData?.data?.data?.links)
                      ? selectedProjectData?.data?.data?.links.join(", ")
                      : selectedProjectData?.data?.data?.links || "NA"}
                  </p>
                  <p>
                    <strong>Assigned Users:</strong>{" "}
                    {Array.isArray(
                      selectedProjectData?.data?.data?.assigned_users
                    )
                      ? selectedProjectData?.data?.data?.assigned_users.join(
                          ", "
                        )
                      : selectedProjectData?.data?.data?.assigned_users || "NA"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;