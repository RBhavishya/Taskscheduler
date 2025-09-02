import { createFileRoute } from "@tanstack/react-router";
import Tasks from "../../../components/Taskfiles/Tasks";

export const Route = createFileRoute("/_layout/tasks/")({
  component: Tasks,
});
