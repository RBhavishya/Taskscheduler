import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import loginimage from "../assets/loginimage.png";
import slackicon from "../assets/slackicon.svg";

const Loginpage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSlackLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api-task-sheduler-org.onrender.com/v1.0/auth/slack",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert("Unable to start Slack login. Please try again.");
      }
    } catch (error) {
      console.error("Slack login error:", error);
      alert("Slack login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check redirect from Slack
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const success = params.get("success");

    if (status === "200" || success === "true") {
      const user = { name: "Slack User" };
      localStorage.setItem("user", JSON.stringify(user));
      navigate({ to: "/dashboard" });
    } else if (status && success !== "true") {
      alert("Slack authorization failed. Please try again.");
      navigate({ to: "/" });
    }
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen">
      <div className="w-1/2 h-full flex items-center justify-center bg-white">
        <img
          src={loginimage}
          alt="Login Illustration"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center bg-white">
        <div className="text-center space-y-8 px-6">
          <p className="uppercase tracking-wider text-gray-600 font-medium">
            Welcome Back.
          </p>

          <button
            onClick={handleSlackLogin}
            disabled={loading}
            className="flex items-center gap-3 px-6 py-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md bg-white transition"
          >
            <img src={slackicon} alt="Slack" className="w-5 h-5" />
            <span className="text-gray-700 font-medium">
              Continue with Slack
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
