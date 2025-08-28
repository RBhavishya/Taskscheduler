import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ProjectData, User } from "@/lib/interfaces/project";
import { checkProjectTitleAPI, createProjectAPI, getAllUsersAPI } from "@/https/services/project";

const AddProjectForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<number[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createProjectAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      resetForm();
      navigate({ to: "/projects" });
    },
    onError: (error) => {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setErrorUsers(null);
      try {
        const response = await getAllUsersAPI();
        console.log("Users Response:", response);
        setUsersList(response.data?.users || response.data || (response as any).users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setErrorUsers("Failed to load users");
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

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
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Project title is required");
      return;
    }

    try {
      const titleExists = await checkProjectTitleAPI(title);
      if (titleExists) {
        alert("Project already exists");
        return;
      }

      const projectData: ProjectData = {
        title,
        description: description || undefined,
        links: links.length ? links : undefined,
        created_by: user.id?.toString() || "unknown",
        start_date: toUTCDate(startDate),
        due_date: dueDate ? toUTCDate(dueDate) : undefined,
        assigned_users: assignedUsers.length ? assignedUsers : undefined,
      };

      mutation.mutate(projectData);
    } catch (error) {
      console.error("Error checking project title:", error);
      alert("Failed to check project title");
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
  };

  return (
    <div className="mt-6 p-6 bg-white shadow rounded-xl border max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4">Add Project</h2>

      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Project Title</label>
        <input
          type="text"
          placeholder="Enter Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Project Description</label>
        <textarea
          placeholder="Enter Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Start Date */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Start Date</label>
        <input
          type="date"
          placeholder=""
          pattern="\d{4}-\d{2}-\d{2}"
          value={startDate ? formatDate(startDate) : ""}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
          style={{ colorScheme: "light" }}
        />
      </div>

      {/* Due Date */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Due Date</label>
        <input
          type="date"
          placeholder="yyyy-mm-dd"
          pattern="\d{4}-\d{2}-\d{2}"
          value={dueDate ? formatDate(dueDate) : ""}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
          style={{ colorScheme: "light" }}
        />
      </div>

      {/* Assigned Users */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Assign Users</label>
        {isLoadingUsers ? (
          <p>Loading users...</p>
        ) : errorUsers ? (
          <p className="text-red-500">{errorUsers}</p>
        ) : (
          <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
            {usersList.length === 0 ? (
              <p className="text-gray-500">No users available</p>
            ) : (
              usersList.map((u) => (
                <label key={u.id} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={assignedUsers.includes(u.id)}
                    onChange={() => toggleAssignedUser(u.id)}
                  />
                  ({u.id}) {u.name}
                </label>
              ))
            )}
          </div>
        )}
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
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => navigate({ to: "/projects" })}
          className="px-4 py-2 border rounded-lg text-purple-500 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddProjectForm;