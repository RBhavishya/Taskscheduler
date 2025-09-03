import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Eye, Edit } from "lucide-react";
import { Task, TaskResponse } from "@/lib/interfaces/project";
import { getTasksByProjectId } from "@/https/services/project";

interface TasksTableProps {
  projectId: number;
}

const TasksTable: React.FC<TasksTableProps> = ({ projectId }) => {
  
  const { data, isLoading, error } = useQuery<TaskResponse, Error>({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasksByProjectId(projectId),
    enabled: !!projectId, 
  });


 
  const taskColumns: ColumnDef<Task>[] = [
    { header: "S.No", accessorFn: (_row, index) => index + 1 },
    { header: "Task Name", accessorKey: "task_title" },
    { header: "Start Date", accessorKey: "start_date" ,cell: ({ row }) => (
      <div>
        {new Date(row.getValue("start_date")).toLocaleDateString("en-CA")}
      </div>
    ),},
    { header: "Due Date", accessorKey: "end_date" ,cell: ({ row }) => (
      <div>
        {new Date(row.getValue("end_date")).toLocaleDateString("en-CA")}
      </div>
    ),},
    { header: "Status", accessorKey: "task_status" },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button title="View">
            <Eye />
          </button>
          <button title="Edit">
            <Edit />
          </button>
        </div>
      ),
    },
  ];

  
  const table = useReactTable({
    data: data?.data.data.records || [], 
    columns: taskColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.data.data.records || data.data.data.records.length === 0) {
    return <p>No tasks found for this project.</p>;
  }

  return (
    <table border={1} cellPadding={6} cellSpacing={0}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
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
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TasksTable;