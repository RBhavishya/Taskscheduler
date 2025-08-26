import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface User {
  id: number;
  slack_id: string;
  user_name: string;
  display_name: string;
  email: string;
  profile_pic: string;
  designation: string;
  phone: string;
  user_type: string;
  user_status: string;
  created_at: string;
}

const UserDetails: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p className="text-gray-500">No user data found</p>;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 16) return "Good Afternoon";
    if (hour >= 16 && hour < 20) return "Good Evening";
    return "Good Night";
  };

  return (
    <div className="mb-6 w-full">
      {/* Top profile header */}
      <div className="flex items-center space-x-4 mb-1">
        <img
          src={user.profile_pic}
          alt={user.display_name}
          className="h-12 w-12 rounded-full object-cover shadow-md"
        />
        <div>
          <p className="font-semibold">{user.display_name}</p>
          <p className="text-sm text-gray-500">
            {getGreeting()}, {user.display_name}
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="profile">
          <AccordionTrigger>User Details</AccordionTrigger>
          <AccordionContent>
            <div className="text-sm space-y-2">
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {user.phone}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default UserDetails;
