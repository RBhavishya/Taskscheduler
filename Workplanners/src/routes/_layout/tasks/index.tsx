import { createFileRoute } from "@tanstack/react-router";
import Tasks from "../../../components/Tasks";

export const Route = createFileRoute("/_layout/tasks/")({
  component: Tasks,
});
