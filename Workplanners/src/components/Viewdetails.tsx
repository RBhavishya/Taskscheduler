import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const BASE_API = "https://api-task-sheduler-org.onrender.com/v1.0";

const Viewdetails = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();

  // Fetch project details by ID
  const fetchProjectById = async () => {
    const res = await fetch(`${BASE_API}/projects/${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch project details");
    return res.json();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: fetchProjectById,
    enabled: !!projectId,
  });

  if (isLoading) return <p>Loading project details...</p>;
  if (isError) return <p className="text-red-500">Error loading project</p>;

  const project = data?.data;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/projects/edit/${project.id}`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => navigate(`/projects/delete/${project.id}`)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-gray-700">
        {project.description || "No Description"}
      </p>

      {/* Project details */}
      <div className="space-y-2 text-gray-800">
        <p>
          <strong>Status:</strong> {project.status || "NA"}
        </p>
        <p>
          <strong>Created By:</strong> {project.created_by || "NA"}
        </p>
        <p>
          <strong>Updated By:</strong> {project.updated_by || "NA"}
        </p>
        <p>
          <strong>Start Date:</strong> {project.start_date || "NA"}
        </p>
        <p>
          <strong>Due Date:</strong> {project.due_date || "NA"}
        </p>

        {/* Assigned users if any */}
        {project.assigned_users?.length > 0 && (
          <p>
            <strong>Assigned Users:</strong> {project.assigned_users.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default Viewdetails;
