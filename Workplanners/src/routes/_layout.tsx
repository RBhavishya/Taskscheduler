import Sidebar from "@/components/Sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  console.log("layout");
  return (
    <div className=" flex">
      <div className="">
        <Sidebar />
      </div>
      <div className="h-screen ml-90 ">
        <Outlet />
      </div>
    </div>
  );
}
