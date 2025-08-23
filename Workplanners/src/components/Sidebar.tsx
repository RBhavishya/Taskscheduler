import React from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ClipboardList,
  NotebookPen,
  Bell,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const Sidebar = () => {
  return (
    <aside className="w-[250px] bg-purple-50 border-r fixed left-0 top-0 h-full p-4">
      {/* Skeleton / User Info */}
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <p className="font-semibold">Bhavishya </p>
          <p className="text-sm text-gray-500">Morning, Bhavishya</p>
        </div>
      </div>
      <hr />
      {/* Menu */}
      <h2 className="text-xl font-bold text-gray-500 mb-4 mt-3">MENU</h2>
      <nav className="flex flex-col space-y-3">
        <Link
          to="/dashboard"
          className="flex items-center px-3 py-2 rounded text-gray-500 hover:bg-purple-100"
          activeProps={{ className: "bg-purple-100 text-purple-500 font-bold" }}
        >
          <LayoutDashboard className="mr-2" size={20} />
          Dashboard
        </Link>

        <Link
          to="/tasks"
          className="flex items-center px-3 py-2 rounded text-gray-500 hover:bg-purple-100"
          activeProps={{ className: "bg-purple-100 text-purple-500 font-bold" }}
        >
          <ClipboardList className="mr-2" size={20} />
          Tasks
        </Link>

        <Link
          to="/projects"
          className="flex items-center px-3 py-2 rounded text-gray-500 hover:bg-purple-100"
          activeProps={{ className: "bg-purple-100 text-purple-500 font-bold" }}
        >
          <NotebookPen className="mr-2" size={20} />
          Projects
        </Link>

        <Link
          to="/notifications"
          className="flex items-center px-3 py-2 rounded text-gray-500 hover:bg-purple-100"
          activeProps={{ className: "bg-purple-100 text-purple-500 font-bold" }}
        >
          <Bell className="mr-2" size={20} />
          Notifications
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
