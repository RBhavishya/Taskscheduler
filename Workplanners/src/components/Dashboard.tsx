import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Search,
  ClipboardList,
  ClipboardCheck,
  ClipboardPenLine,
  FileClock,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Statisticstable from "./Statisticstable";

const Dashboard = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  // Month pickers
  const [startMonth, setStartMonth] = useState<Date | null>(new Date());
  const [endMonth, setEndMonth] = useState<Date | null>(new Date());

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

  const cards = [
    {
      id: 1,
      bg: "#F1E7FF",
      title: "Total Tasks",
      value: 0,
      icon: <ClipboardList className="w-10 h-10 text-purple-400" />,
      route: "/details/1",
    },
    {
      id: 2,
      bg: "#E5F5FF",
      title: "Completed Tasks",
      value: 0,
      icon: <ClipboardCheck className="w-10 h-10 text-blue-400" />,
      route: "/details/2",
    },
    {
      id: 3,
      bg: "#FFEFE7",
      title: "In Progress Tasks",
      value: 0,
      icon: <ClipboardPenLine className="w-10 h-10 text-orange-400" />,
      route: "/details/3",
    },
    {
      id: 4,
      bg: "#EBFEEF",
      title: "Pending Tasks",
      value: 0,
      icon: <FileClock className="w-10 h-10 text-green-400" />,
      route: "/details/4",
    },
  ];

  return (
    <div className="p-4">
      {/* Search + Clock */}
      <div className="flex items-center mb-6 w-full">
        <div className="flex items-center w-3/4 rounded-full border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Find your Task, Projects.."
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
          />
        </div>

        <div className="h-10 w-px bg-gray-300 mx-6"></div>

        <div className="flex flex-col justify-around w-1/4">
          <span className="text-lg font-semibold">{formattedTime}</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>

      <div className="w-full h-7 border-t border-gray-200"></div>

      {/* Cards + Month Pickers */}
      <div className="w-3/4">
        <div className="bg-white p-2 rounded-xl shadow gap-2">
          {/* Month Range Picker */}
          <div className="flex justify-end py-2">
            <div
              className="inline-flex rounded items-center gap-4"
              style={{
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #D5B8FF",
                background: "#FFF",
              }}
            >
              <div>
                <label className="block text-sm mb-1">Start Month</label>
                <DatePicker
                  selected={startMonth}
                  onChange={(date) => setStartMonth(date)}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  className="border rounded p-2"
                />
              </div>
              <span className="font-medium">to</span>
              <div>
                <label className="block text-sm mb-1">End Month</label>
                <DatePicker
                  selected={endMonth}
                  onChange={(date) => setEndMonth(date)}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  className="border rounded p-2"
                />
              </div>
            </div>
          </div>

          {/* Task cards */}
          <div className="flex rounded gap-4">
            {cards.map((card, index) => (
              <Card
                key={index}
                onClick={() => navigate({ to: card.route })}
                className="cursor-pointer hover:shadow-lg transition-shadow rounded-3xl"
                style={{
                  width: "210px",
                  height: "140px",
                  flexShrink: 0,
                  background: card.bg,
                }}
              >
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center px-9">
                  <span className="text-3xl font-bold">{card.value}</span>
                  {card.icon}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Statisticstable />
      </div>
    </div>
  );
};

export default Dashboard;
