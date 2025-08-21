import * as React from "react";
import {
  useNavigate,
  useLocation,
  useSearch,
  useParams,
} from "@tanstack/react-router";
import loginimage from "../assets/loginimage.png";
import slackicon from "../assets/slackicon.svg";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const Loginpage = () => {
  const location = useLocation();
  const url = new URLSearchParams(window.location.search);
  const code1 = url.get("code");
  const [code2, setCode2] = React.useState<string>();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as any;
  const code = search?.code;
  useEffect(() => {
    const code = search?.code;
    if (code) {
      setCode2(code);
    }
  }, [url, location, search]);
  const slackAuthMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        "https://api-task-sheduler-org.onrender.com/v1.0/auth/slack",
        { method: "GET" }
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.data?.authUrl) {
        window.location.href = data?.data?.authUrl;
      } else {
        alert("Unable to start Slack login. Please try again.");
      }
    },
    onError: () => {
      alert("Slack login error. Please try again.");
    },
  });
  const slackCallbackMutation = useMutation({
    mutationFn: async (code2: string) => {
      const res = await fetch(
        `https://api-task-sheduler-org.onrender.com/v1.0/auth/slack/callback?code=${code2}`,
        {
          method: "GET",
        }
      );

      return res.json();
    },
    onSuccess: (data) => {
      if (data?.status === 200) {
        localStorage.setItem("user", JSON.stringify(data?.user));

        navigate({ to: "/dashboard" });
      }
    },
    onError: (err) => {
      navigate({ to: "/" });
    },
  });
  useEffect(() => {
    if (code2) {
      slackCallbackMutation.mutate(code2);
    }
  }, [code2]);
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
