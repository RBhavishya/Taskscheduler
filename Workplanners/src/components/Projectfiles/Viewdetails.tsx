import { useNavigate, useParams } from "@tanstack/react-router";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import TasksInProjectTable from "../core/Sampletable";
import {
  getProjectByIdAPI,
  patchProjectStatusAPI,
  getAssignedUsersAPI,
  deleteAssignedUserAPI,
  getAvailableUsersAPI,
  assignUserAPI,
} from "@/https/services/project";

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-purple-100 text-purple-800",
  Review: "bg-orange-100 text-orange-800",
  Completed: "bg-green-100 text-green-800",
};

const Viewdetails = () => {
  const { id } = useParams({ from: "/_layout/projects/$id/" });
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState<string>("");
  const [editingStatus, setEditingStatus] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");

  const queryClient = useQueryClient();
  const Navigate = useNavigate();

  // Fetch project details
  const { data, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectByIdAPI(Number(id)),
    
  });

  // Fetch assigned users
  useQuery({
    queryKey: ["assignedUsers", id],
    queryFn: () => getAssignedUsersAPI(Number(id)),
  });

  // Fetch available users
  useQuery({
    queryKey: ["availableUsers", id],
    queryFn: () => getAvailableUsersAPI(Number(id)),
  });

  // Mutations
  const patchStatusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      patchProjectStatusAPI(Number(id), { project_status: newStatus }),
    onSuccess: (res:any) => {
      toast.success("Status updated successfully");
      setStatus(res.data.data.project_status);
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || "Failed to update status");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => deleteAssignedUserAPI(Number(id), userId),
    onSuccess: () => {
      toast.success("User removed successfully");
      queryClient.invalidateQueries({ queryKey: ["assignedUsers", id] });
      queryClient.invalidateQueries({ queryKey: ["availableUsers", id] });
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || "Failed to remove user");
    },
  });

  const assignUserMutation = useMutation({
    mutationFn: (userId: number) => assignUserAPI(Number(id), userId),
    onSuccess: () => {
      toast.success("User assigned successfully");
      setSelectedUser("");
      queryClient.invalidateQueries({ queryKey: ["assignedUsers", id] });
      queryClient.invalidateQueries({ queryKey: ["availableUsers", id] });
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || "Failed to assign user");
    },
  });

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading project</p>;

  const projectdata = data?.data.data;
  if (!projectdata) return <p>No project found</p>;

  // Helpers
  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-CA") : "NA";

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    patchStatusMutation.mutate(newStatus);
    setEditingStatus(false);
  };

  const handleRemoveUser = (userId: number) => {
    deleteUserMutation.mutate(userId);
  };

  const handleAssignUser = () => {
    if (selectedUser) {
      assignUserMutation.mutate(Number(selectedUser));
    }
  };

  return (
    <div className="p-4">
      {/* Clock & Date */}
      <div className="flex items-center mb-6 w-full">
        <div className="h-10 w-px bg-gray-300 mx-6"></div>
        <div className="flex flex-col justify-around w-1/4">
          <span className="text-lg font-semibold">{formattedTime}</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>

      {/* Title + Description */}
      <div className="border border-gray-300 rounded-xl p-4 mb-6 bg-gray-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
            {projectdata.title?.charAt(0) || "P"}
          </div>
          <div className="flex items-center gap-[3px] text-xl font-semibold">
            <span>{projectdata.title}</span>
            <span className="text-sm text-gray-600">
              ({projectdata.project_status || "NA"})
            </span>
          </div>
        </div>
        <p className="text-gray-700 mt-2">
          {projectdata.description || "No description available"}
        </p>
      </div>

      {/* Main Layout */}
      <div className="border border-gray-200 bg-white rounded-3xl shadow-lg p-6 flex gap-6 min-h-[600px]">
        {/* Left: Tasks Table */}
        <div className="w-2/3">
          <TasksInProjectTable projectId={Number(id)} />
        </div>

        {/* Right: Details */}
        <div className="w-1/3 border border-gray-200 rounded-3xl p-4">
          <div className="text-2xl font-bold mb-4">Details</div>

          {/* Created By */}
          <div className="flex items-center gap-3 mb-4">
            {projectdata.createdByUser?.profile_pic ? (
              <img
                src={projectdata.createdByUser.profile_pic}
                alt={projectdata.createdByUser.display_name}
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                {projectdata.createdByUser?.display_name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <p className="font-medium">
                {projectdata.createdByUser?.display_name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500">Created By</p>
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <strong>Status:</strong>{" "}
            {editingStatus ? (
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                onBlur={() => setEditingStatus(false)}
                className="border rounded p-1"
              >
                {Object.keys(statusColors).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className={`px-2 py-1 rounded-full ${statusColors[status]}`}
                onClick={() => setEditingStatus(true)}
                style={{ cursor: "pointer" }}
              >
                {status || "NA"}
              </span>
            )}
          </div>

          {/* Dates */}
          <p className="mb-2">
            <strong>Start Date:</strong> {formatDate(projectdata.start_date)}
          </p>
          <p className="mb-2">
            <strong>Due Date:</strong> {formatDate(projectdata.due_date)}
          </p>

          {/* Assigned Users */}
          <div className="mt-6">
            <strong>Assigned Users:</strong>
            <ul className="mt-2">
              {assignedUsers.length === 0 && (
                <li className="text-gray-500">No users assigned.</li>
              )}
              {assignedUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-2 mb-1 px-2 py-1 rounded border"
                >
                  <span>{user.display_name}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            {/* Assign New User */}
            <div className="flex items-center gap-2 mt-3">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(Number(e.target.value))}
                className="border rounded p-1 flex-1"
              >
                <option value="">Select user...</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.display_name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignUser}
                disabled={!selectedUser}
                className="px-3 py-1 bg-purple-600 text-white rounded disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewdetails;
