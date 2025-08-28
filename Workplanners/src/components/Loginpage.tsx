import * as React from "react";
import { useNavigate, useLocation, useSearch } from "@tanstack/react-router";
import loginimage from "../assets/loginimage.png";
import slackicon from "../assets/slackicon.svg";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const Loginpage = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as any;

  const [code2, setCode2] = React.useState<string>();

  // ✅ Watch for Slack code in URL
  useEffect(() => {
    if (search?.code) {
      setCode2(search.code);
    }
  }, [search]);

  // ✅ Step 1: Get Slack Auth URL
  const slackAuthMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        "https://api-task-sheduler-org.onrender.com/v1.0/auth/slack",
        { method: "GET" }
      );
      if (!res.ok) throw new Error("Failed to start Slack login");
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.data?.authUrl) {
        window.location.href = data.data.authUrl;
      } else {
        alert("Unable to start Slack login. Please try again.");
      }
    },
    onError: () => {
      alert("Slack login error. Please try again.");
    },
  });

  // ✅ Step 2: Handle Slack callback
  const slackCallbackMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch(
        `https://api-task-sheduler-org.onrender.com/v1.0/auth/slack/callback?code=${code}`,
        { method: "GET" }
      );
      if (!res.ok) throw new Error("Slack callback failed");
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.status === 200) {
        const user = data?.data?.user;
        const token = data?.data?.token;

        if (user && token) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("access_token", token.access_token);
          localStorage.setItem("refresh_token", token.refresh_token);
          localStorage.setItem("expires_at", String(token.expires_at));
        }
        navigate({ to: "/dashboard" });
      }
    },
    onError: () => {
      navigate({ to: "/" });
    },
  });

  // ✅ Fire callback when code is present
  useEffect(() => {
    if (code2) {
      slackCallbackMutation.mutate(code2);
    }
  }, [code2]);

  return (
    <div className="flex h-screen w-screen">
      {/* Left side image */}
      <div className="w-1/2 h-full flex items-center justify-center bg-white">
        <img
          src={loginimage}
          alt="Login Illustration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side login */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-white">
        <div className="text-center space-y-8 px-6">
          <p className="uppercase tracking-wider text-gray-600 font-medium">
            Welcome Back.
          </p>
          <button
            onClick={() => slackAuthMutation.mutate()}
            className="flex items-center gap-3 px-6 py-3 border border-gray-300 rounded-lg"
          >
            <img src={slackicon} alt="Slack" className="w-5 h-5" />
            <span className="text-gray-700 font-medium">
              {slackAuthMutation.isPending || slackCallbackMutation.isPending
                ? "Logging in..."
                : "Continue with Slack"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
