import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTaskForm from "src/components/AddTaskForm";

const Tasks = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);

  const cards = [
    { id: 1, bg: "#F1E7FF", title: "Today", route: "/details/1", value: 0 },
    { id: 2, bg: "#E5F5FF", title: "Overdue", route: "/details/2" },
    { id: 3, bg: "#FFEFE7", title: "Closed", route: "/details/3" },
  ];
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-GB");
  const formattedDate = time.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  const cards1 = [
    {
      id: 1,
      bg: "#F1E7FF",
      title: "Total Tasks Count",
      icon: <ClipboardList className="w-10 h-10" />,
      value: 0,
    },
    {
      id: 2,
      bg: "#E5F5FF",
      title: "Completed Tasks",
      icon: <ClipboardList className="w-10 h-10" />,
      value: 0,
    },
    {
      id: 3,
      bg: "#FFEFE7",
      title: "Pending Tasks",
      icon: <ClipboardList className="w-10 h-10" />,
      value: 0,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center mb-6 w-full">
        <div className="flex w-3/4 justify-center rounded gap-4">
          {cards?.length &&
            cards.map((card: any, index: number) => (
              <Card
                key={index}
                onClick={() => navigate({ to: card.route })}
                className="cursor-pointer hover:shadow-lg transition-shadow rounded-3xl"
                style={{
                  width: "160px",
                  height: "60px",
                  flexShrink: 0,
                  background: card.bg,
                }}
              >
                <CardHeader>
                  <CardTitle>{card?.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center px-9">
                  <span
                    className="w-4 h-4 flex items-center justify-center rounded-full text-white font-bold text-sm"
                    style={{
                      backgroundColor: card.dark,
                    }}
                  >
                    {card.value}
                  </span>
                </CardContent>
              </Card>
            ))}
        </div>
        {/* divider */}
        <div className="h-10 w-px bg-gray-300 mx-6"></div>
        {/* top current time and date */}
        <div className="flex flex-col items-center w-1/4">
          <span className="text-lg font-semibold">{formattedTime}</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>

      <hr />

      <div className="w-full p-4">
        <h1 className="flex text-bold text-2xl">Tasks</h1>
        <div className="flex gap-6 ">
          <div className="flex justify-around rounded gap-1 ml-10 mt-8">
            {cards1?.length &&
              cards1.map((card: any, index: number) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow rounded-2xl"
                  style={{
                    width: "220px",
                    height: "120px",
                    flexShrink: 0,
                    background: card.bg,
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{card.title}</span>
                      {card.icon}
                    </div>
                    <span className="text-2xl font-bold">{card.value}</span>
                  </div>
                </Card>
              ))}
          </div>
          <div
            className=" bg-gray rounded-xl shadow-md p-4 w-130 h-40 "
            style={{ border: "1px solid  #ddb8ffff" }}
          ></div>
        </div>
      </div>
      <hr />
      <div className="mt-6">
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => setOpen(true)}
        >
          + New Task
        </Button>
      </div>

      {/* Modal */}
      <AddTaskForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Tasks;
