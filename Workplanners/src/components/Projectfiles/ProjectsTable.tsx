// components/ProjectsTable.tsx
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteProjectForTable, getProjectsForTable } from "@/https/services/project";
import {Edit, Trash, Eye} from "lucide-react";  
import { ProjectTableAPIResponse, ProjectTableData, ProjectTableUser } from "@/lib/interfaces/project";

const ProjectsTable: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pageSize = 10;
  const [pageIndex, setPageIndex] = React.useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["projectsTable", pageIndex, pageSize],
    queryFn: () =>
      getProjectsForTable({ page: pageIndex + 1, page_size: pageSize }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectForTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectsTable", pageIndex, pageSize],
      });
    },
  });

  const projects = data?.data.records ?? [];
  const totalPages = data?.data.pagination_info.total_pages ?? 1;

  const columns: ColumnDef<ProjectTableData>[] = [
    {
      id: "serial",
      header: "S.No",
      cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
    },
    {
      accessorKey: "projectName",
      header: "Project Name",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.projectLogoUrl ? (
            <img
              src={row.original.projectLogoUrl}
              alt="Project Logo"
              className="w-6 h-6 rounded-full mr-2 object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs mr-2">
              {row.original.projectName[0]?.toUpperCase()}
            </div>
          )}
          <span>{row.original.projectName}</span>
        </div>
      ),
    },
    {
      accessorKey: "users",
      header: "Assigned Users",
      cell: ({ getValue }) => (
        <div className="flex -space-x-2">
          {(getValue() as ProjectTableUser[])?.map((user) => (
            <div
              key={user.userId}
              className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs border-2 border-white"
            >
              {user.displayName[0]?.toUpperCase()}
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "projectStatus",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>().toUpperCase();
        let color = "bg-gray-500";
        let displayStatus = status;

        switch (status) {
          case "NEW":
            color = "bg-blue-500";
            displayStatus = "New";
            break;
          case "INPROGRESS":
            color = "bg-yellow-500";
            displayStatus = "In Progress";
            break;
          case "OVERDUE":
            color = "bg-red-500";
            displayStatus = "Overdue";
            break;
          case "COMPLETED":
          case "DONE":
            color = "bg-green-500";
            displayStatus = "Done";
            break;
          case "REVIEW":
            color = "bg-purple-500";
            displayStatus = "Review";
            break;
        }

        return (
          <span className={`px-2 py-1 rounded text-white text-sm ${color}`}>
            {displayStatus}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/projects/view/${row.original.projectId}`)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Eye />
          </button>
          <button
            onClick={() => navigate(`/projects/edit/${row.original.projectId}`)}
            className="text-green-500 hover:text-green-700"
          >
            <Edit />
          </button>
          <button
            onClick={() => handleDelete(row.original.projectId)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(projectId);
    }
  };

  const table = useReactTable<ProjectTableData>({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-2 text-sm text-gray-700 border-b"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectsTable;
