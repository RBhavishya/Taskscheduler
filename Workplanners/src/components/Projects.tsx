import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { getAllProjectsAPI, getProjectByIdAPI } from "@/https/services/project";
import { ProjectData } from "@/lib/interfaces/project";
const Projects = () => {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
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

  // Fetch all projects
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjectsAPI,
  });

  // Fetch project by ID
  const {
    data: selectedProjectData,
    isLoading: loadingProject,
    isError: errorProject,
  } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: () => getProjectByIdAPI(selectedProjectId!),
    enabled: !!selectedProjectId,
  });

  const existingProjects = data?.data?.records || [];
  const filteredProjects = existingProjects.filter((p: ProjectData) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleNavigation = () => {
    navigate({ to: "/projects/add" });
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
    return <p className="text-red-500">Error fetching projects</p>;
  }

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="flex items-center mb-6 w-full">
        <div className="h-10 w-px bg-gray-300 mx-6 ml-[250px]"></div>
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
            onClick={handleNavigation}
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
          {filteredProjects.map((project: ProjectData) => (
            <Card
              key={project.id}
              className="p-4 shadow-lg rounded-2xl hover:shadow-xl cursor-pointer"
              onClick={() => {
                setSelectedProjectId(project.id ?? null);
                setShowDetails(false);
              }}
            >
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {project.title.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-lg font-semibold">{project.title}</h2>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Details */}
        <div className="w-1/3 bg-gray-50 p-6 rounded-xl shadow-inner">
          {!selectedProjectId ? (
            <p className="text-gray-500">Select a project to view details</p>
          ) : loadingProject ? (
            <p>Loading project details...</p>
          ) : errorProject ? (
            <p className="text-red-500">Error loading project</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white font-bold text-2xl">
                  {selectedProjectData?.data?.title?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold">
                  {selectedProjectData?.data?.title}
                </h2>
              </div>
              <h2 className="flex items-center justify-center text-semibold text-2xl">
                About
              </h2>
              <p className="flex items-center justify-center mb-4 text-gray-600">
                {selectedProjectData?.data?.description || "No Description"}
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
                    {selectedProjectData?.data?.status || "NA"}
                  </p>
                  <p>
                    <strong>Created By:</strong>{" "}
                    {selectedProjectData?.data?.created_by || "NA"}
                  </p>
                  <p>
                    <strong>Updated By:</strong>{" "}
                    {selectedProjectData?.data?.updated_by || "NA"}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {selectedProjectData?.data?.start_date || "NA"}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {selectedProjectData?.data?.due_date || "NA"}
                  </p>
                  <p>
                    <strong>Links:</strong>{" "}
                    {selectedProjectData?.data?.links?.join(", ") || "NA"}
                  </p>
                  <p>
                    <strong>Assigned Users:</strong>{" "}
                    {selectedProjectData?.data?.assigned_users?.join(", ") ||
                      "NA"}
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
