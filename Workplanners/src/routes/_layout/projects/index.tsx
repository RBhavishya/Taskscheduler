import { createFileRoute } from "@tanstack/react-router";
import Projects from "../../../components/Projects";

export const Route = createFileRoute("/_layout/projects/")({
  component: Projects,
});
