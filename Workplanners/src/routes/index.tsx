import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-2 bg-white">
      <h3 className="text-red-600">Welcome Home!!!</h3>
      <h1 className="text-green-500">bhavishya</h1>
      <p className="bg-white text-violet-900 text-3xl">Lathasri</p>

      <Button>Start</Button>
    </div>
  );
}
