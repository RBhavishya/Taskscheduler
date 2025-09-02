import { useNavigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getProjectByIdAPI } from "@/https/services/project";
import { useState, useEffect } from "react";
import ProjectTable from "../core/Tanstacktable";
const Viewdetails = () => {
  const { id } = useParams({ from: "/_layout/projects/view/$id/" });

  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const Navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectByIdAPI(Number(id)),
  });

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

  const handleNavigation = () => {
    Navigate({ to: `/projects/add` });
  };
  return (
    <div className="p-4">
      <div className="flex items-center mb-6 w-full">
        <div className="h-10 w-px bg-gray-300 mx-6"></div>
        <div className="flex flex-col justify-around w-1/4">
          <span className="text-lg font-semibold">{formattedTime}</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>
      <div className="w-full h-7 border-t border-gray-200"></div>
      <div className="w-full min-h-[600px] bg-white rounded-3xl shadow-lg p-6">
        {/* Title */}
        <div className="text-2xl font-bold mb-4">{projectdata.title}</div>

        {/* Content split into 2/3 and 1/3 */}
        <div className="flex gap-6">
          {/* Table Section (2/3) */}
          <div className="w-2/3">
            <ProjectTable />
          </div>

          {/* Details Section (1/3) */}
          <div className="w-1/3 border border-gray-200 rounded-3xl ">
            <div className="flex flex-col w-full p-4">
              <div className="text-2xl font-bold mb-4">Details</div>
              <div className="text-xl font-semibold mb-2">
                {projectdata.title}
              </div>
              <p>
                <strong>Status:</strong> {projectdata.project_status || "NA"}
              </p>
              <p>
                <strong>Created By:</strong> {projectdata.created_by || "NA"}
              </p>
              <p>
                <strong>Updated By:</strong> {projectdata.updated_by || "NA"}
              </p>
              <p>
                <strong>Start Date:</strong> {projectdata.start_date || "NA"}
              </p>
              <p>
                <strong>Due Date:</strong> {projectdata.due_date || "NA"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewdetails;
