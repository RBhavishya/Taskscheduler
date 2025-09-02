import { createFileRoute } from "@tanstack/react-router";
import Projects from "../../../components/Projectfiles/Projects";

export const Route = createFileRoute("/_layout/projects/")({
  component: Projects,
});
