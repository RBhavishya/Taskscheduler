import { createFileRoute } from "@tanstack/react-router";
import Loginpage from "../components/Loginfiles/Loginpage";
import { authMiddleware } from "../lib/helpers/middleware";

export const Route = createFileRoute("/")({
  beforeLoad: authMiddleware,
  component: Loginpage,
});
