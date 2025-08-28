import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import AddProjectForm, { ProjectData } from "./AddProjectForm";

const BASE_API = "https://api-task-sheduler-org.onrender.com/v1.0";

const Projects = () => {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);

  const queryClient = useQueryClient();

  // Clock
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
  const fetchProjects = async () => {
    const token = localStorage.getItem("access_token"); // get token
    const res = await fetch(`${BASE_API}/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // Fetch project by ID
  const fetchProjectById = async (id: number) => {
    const res = await fetch(`${BASE_API}/projects/${id}`);
    if (!res.ok) throw new Error("Failed to fetch project details");
    return res.json();
  };
  const {
    data: selectedProjectData,
    isLoading: loadingProject,
    isError: errorProject,
  } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: () => fetchProjectById(selectedProjectId!),
    enabled: !!selectedProjectId,
  });

  // Mutation for adding new project
  const addProjectMutation = useMutation({
    mutationFn: async (newProject: ProjectData) => {
      const res = await fetch(`${BASE_API}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add project");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowForm(false);
    },
  });

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

  const existingProjects = data?.data?.records || [];

  const handleSaveProject = (projectData: ProjectData) => {
    const exists = existingProjects.some(
      (p: any) => p.title.toLowerCase() === projectData.title.toLowerCase()
    );
    if (exists) {
      alert("Project already exists");
      return;
    }
    addProjectMutation.mutate(projectData);
  };

  const filteredProjects = existingProjects.filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="flex items-center mb-6 w-full">
        <div className="h-10 w-px bg-gray-300 mx-6 ml-250"></div>
        <div className="flex flex-col justify-around w-1/4">
          <span className="text-lg font-semibold">{formattedTime}</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>

      <div className="w-full h-7 border-t border-gray-200"></div>

      {/* Title & Controls */}
      <div className="flex items-center justify-between mb-7 px-4">
        <h2 className="flex font-bold text-2xl mb-7">Projects</h2>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <input
            type="text"
            placeholder="Search project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg w-1/3"
          />
          <button
            onClick={() => setShowForm(true)}
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
          {filteredProjects.map((project: any) => (
            <Card
              key={project.id}
              className="p-4 shadow-lg rounded-2xl hover:shadow-xl cursor-pointer"
              onClick={() => {
                setSelectedProjectId(project.id);
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
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-500 text-white font-bold text-2xl mb-4">
                  {selectedProjectData?.data?.title?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  {selectedProjectData?.data?.title}
                </h2>
              </div>

              <button
                onClick={() => setShowDetails((prev) => !prev)}
                className="px-4 py-2 mb-6 bg-purple-600 text-white rounded-lg hover:bg-purplr-700"
              >
                {showDetails ? "Hide Details" : "View"}
              </button>

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                About
              </h2>
              <p className="flex items-center mb-4 text-gray-600">
                {selectedProjectData?.data?.description || "No Description"}
              </p>
              {showDetails && (
                <div className="space-y-2 text-gray-700 w-full">
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
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Project Form */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <AddProjectForm
            nextId={
              existingProjects.length > 0
                ? Math.max(...existingProjects.map((p: any) => p.id)) + 1
                : 1
            }
            onSave={handleSaveProject}
            onCancel={() => setShowForm(false)}
          />
        </Dialog>
      )}
    </div>
  );
};

export default Projects;
