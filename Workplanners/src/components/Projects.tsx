import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const Projects = () => {
  const [time, setTime] = useState(new Date());

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

  const fetchProjects = async () => {
    const res = await fetch(
      "https://api-task-sheduler-org.onrender.com/v1.0/projects"
    );
    if (!res.ok) {
      throw new Error("Failed to fetch projects");
    }
    return res.json();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error fetching projects</p>;
  }

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="flex items-center mb-6 w-full">
        {/* Divider */}
        <div className="h-10 w-px bg-gray-300 mx-6 ml-250"></div>

        {/* Current time and date */}
        <div className="flex flex-col justify-around w-1/4">
          <span className="text-lg font-semibold">{formattedTime}</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>

      {/* Horizontal line */}
      <div className="w-full h-7 border-t border-gray-200"></div>

      {/* Page Title */}
      <div className="flex font-bold text-2xl ml-4 mb-7">Projects</div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {data?.data?.records?.map((project: any) => (
          <Card
            key={project.id}
            className="p-4 shadow-lg rounded-2xl hover:shadow-xl transition"
          >
            <CardContent>
              {/* Circle logo + Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {project.title.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-semibold">{project.title}</h2>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm">
                {project.description || "No description provided"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
