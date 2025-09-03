import React from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Eye, Edit, Trash } from "lucide-react";
import { ProjectData } from "@/lib/interfaces/project";

interface ProjectsTableProps {
  projects: ProjectData[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const statusColors: Record<string, string> = {
  NEW: "bg-purple-100 text-purple-600",
  PROGRESS: "bg-blue-100 text-blue-600",
  REVIEW: "bg-yellow-100 text-yellow-700",
  OVERDUE: "bg-red-100 text-red-600",
  DONE: "bg-green-100 text-green-600",
};

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = React.useMemo<ColumnDef<ProjectData>[]>(
    () => [
      {
        header: "S. NO",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Project Name",
        accessorKey: "title",
        cell: ({ row }) => {
          const project = row.original;
          return (
            <div className="flex items-center gap-2">
              {project.logo_url ? (
                <img
                  src={project.logo_url}
                  alt={project.title}
                  className="w-8 h-8 rounded-md"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-purple-500 text-white font-bold">
                  {project.title?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-medium">{project.title}</span>
            </div>
          );
        },
      },
      {
        header: "Assigned User",
        cell: () => (
          <div className="flex -space-x-2">
            {["P", "G", "M"].map((u, idx) => (
              <div
                key={idx}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-400 text-white text-xs font-bold border-2 border-white"
              >
                {u}
              </div>
            ))}
            <span className="ml-2 text-gray-500 text-sm">3+</span>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "project_status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const cls =
            statusColors[status] || "bg-gray-100 text-gray-600";
          return (
            <span
              className={`px-3 py-1 rounded-md text-xs font-medium ${cls}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const project = row.original;
          return (
            <div className="flex gap-2 text-gray-600">
              <button onClick={() => onView(project.id)}>
                <Eye size={18} />
              </button>
              <button onClick={() => onEdit(project.id)}>
                <Edit size={18} />
              </button>
              <button onClick={() => onDelete(project.id)}>
                <Trash size={18} />
              </button>
            </div>
          );
        },
      },
    ],
    [onView, onEdit, onDelete]
  );

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-50 text-left text-gray-600 text-xs font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
