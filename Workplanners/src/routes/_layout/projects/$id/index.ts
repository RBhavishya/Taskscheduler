import Viewdetails from "@/components/Projectfiles/Viewdetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/projects/$id/")({
  component: Viewdetails,
});
