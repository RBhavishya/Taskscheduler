import Viewdetails from "@/components/Viewdetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/projects/view/")({
  component: Viewdetails,
});
