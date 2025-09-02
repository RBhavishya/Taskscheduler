import Projects from "@/components/Projectfiles/Projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/projects/")({
  component: Projects,
});
