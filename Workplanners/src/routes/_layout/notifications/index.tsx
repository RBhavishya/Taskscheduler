import { createFileRoute } from "@tanstack/react-router";
import Notifications from "../../../components/Notifications";

export const Route = createFileRoute("/_layout/notifications/")({
  component: Notifications,
});
