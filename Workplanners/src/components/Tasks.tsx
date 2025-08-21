import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { useNavigate } from "@tanstack/react-router";
const Tasks = () => {
  const navigate = useNavigate();

  const cards = [
    { id: 1, bg: "#F1E7FF", title: "Total Tasks", route: "/details/1" },
    { id: 2, bg: "#E5F5FF", title: "Completed Tasks", route: "/details/2" },
    { id: 3, bg: "#FFEFE7", title: "In Progress Tasks", route: "/details/3" },
    { id: 4, bg: "#EBFEEF", title: "Pending Tasks", route: "/details/4" },
  ];
  return (
    <div className="p-6">
      <div className="flex rounded gap-4">
        {cards?.length &&
          cards.map((card: any, index: number) => (
            <Card
              key={index}
              onClick={() => navigate({ to: card.route })}
              className="cursor-pointer hover:shadow-lg transition-shadow rounded"
              style={{
                width: "190px",
                height: "120px",
                flexShrink: 0,
                borderRadius: "2px",
                background: card.bg,
              }}
            >
              <CardHeader>
                <CardTitle>{card?.title}</CardTitle>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
      </div>
    </div>
  );
};
export default Tasks;
