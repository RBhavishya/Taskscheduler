import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProjectAPI } from "@/https/services/project";
import { ProjectData, User } from "@/lib/interfaces/project";

interface AddProjectFormProps {
  nextId: number;
  onSave?: (data: ProjectData) => void;
  onCancel?: () => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ nextId, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<number[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const queryClient = useQueryClient();

  const {
    data: usersList = [],
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["users", search],
    queryFn: async () => {
      try {
        const res = await fetch(
          `https://api-task-sheduler-org.onrender.com/v1.0/users/dropdown?search_string=${search}`
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const json = await res.json();
        return (json.data?.records || []).map((u: any) => ({
          id: Number(u.id) || 0,
          name: String(u.display_name || "Unknown"),
        })) as User[];
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
  });

  const mutation = useMutation({
    mutationFn: createProjectAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      resetForm();
      if (onCancel) onCancel();
    },
    onError: (error: any) => {
      const errorMessage = error.message || "An unknown error occurred";
      console.error("Error saving project:", errorMessage);
      setFormError(`Failed to save project: ${errorMessage}`);
    },
  });

  const handleAddLink = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && linkInput.trim() !== "") {
      e.preventDefault();
      setLinks([...links, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const toggleAssignedUser = (id: number) => {
    setAssignedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toUTCDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const handleSave = () => {
    setFormError(null);
    const projectData: ProjectData = {
      id: nextId,
      title,
      description,
      links: links.length ? links : [],
      created_by: Number(user.id) || 0,
      start_date: toUTCDate(startDate),
      due_date: dueDate ? toUTCDate(dueDate) : "",
      assigned_users: assignedUsers.length ? assignedUsers : [],
    };
    if (onSave) {
      onSave(projectData);
    } else {
      mutation.mutate(projectData);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLinks([]);
    setLinkInput("");
    setStartDate("");
    setDueDate("");
    setAssignedUsers([]);
    setFormError(null);
    setSearch("");
  };

  return (
    <div className="mt-6 p-6 bg-white shadow rounded-xl border max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Add Project</h2>
      {formError && <p className="text-red-500 mb-4">{formError}</p>}

      {/* Project Title */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Project Title</label>
        <input
          type="text"
          placeholder="Enter Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Project title"
        />
      </div>

      {/* Project Description */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Project Description</label>
        <textarea
          placeholder="Enter Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Project description"
        />
      </div>

      {/* Start Date */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
          style={{ colorScheme: "light" }}
          aria-label="Start date"
        />
      </div>

      {/* Due Date */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
          style={{ colorScheme: "light" }}
          aria-label="Due date"
        />
      </div>

      {/* Search Users */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Search Users</label>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Search users"
        />
      </div>

      {/* Assigned Users */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Assign Users</label>
        <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
          {isLoading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : isError ? (
            <p className="text-red-500">Error loading users</p>
          ) : usersList.length === 0 ? (
            <p className="text-gray-500">No users found</p>
          ) : (
            usersList.map((u: User) => (
              <label key={u.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={assignedUsers.includes(u.id)}
                  onChange={() => toggleAssignedUser(u.id)}
                  aria-label={`Assign user ${u.name}`}
                />
                ({u.id}) {u.name || "Unknown"}
              </label>
            ))
          )}
        </div>
      </div>

      {/* Project Links */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Project Reference Links</label>
        <div className="border rounded-lg p-2 flex flex-wrap gap-2 min-h-[48px]">
          {links.map((link, index) => (
            <span
              key={index}
              className="flex items-center gap-2 bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm"
            >
              {link}
              <button
                type="button"
                className="text-xs text-purple-500 hover:text-purple-700"
                onClick={() => handleRemoveLink(index)}
                aria-label={`Remove link ${link}`}
              >
                ✕
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add a link and press Enter"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={handleAddLink}
            className="flex-1 outline-none bg-transparent text-sm"
            aria-label="Add project reference link"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg text-purple-500 hover:bg-gray-100"
          aria-label="Cancel"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          disabled={mutation.isPending}
          aria-label="Save project"
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddProjectForm;