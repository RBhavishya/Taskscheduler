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
  console.log(window.location.href, "ggg001");
  const location = useLocation();
  const url = new URLSearchParams(window.location.search);
  const code1 = url.get("code");
  console.log(code1, url, "gggggg");
  const [code2, setCode2] = React.useState<string>();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as any;
  const code = search?.code;
  console.log(code, "code001");
  useEffect(() => {
    console.log(url, location, "useeffectuuuuuuuuu");
    const code = search?.code;
    if (code) {
      setCode2(code);
    }
  }, [url, location, search]);
  console.log(url, "paaa");
  const slackAuthMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        "https://api-task-sheduler-org.onrender.com/v1.0/auth/slack",
        { method: "GET" }
      );
      console.log("frst api calleddddddddddddd", res);
      // if (!res.ok) throw new Error("Unable to get Slack Auth URL");
      return res.json();
    },
    onSuccess: (data) => {
      console.log(data?.data?.authUrl, "apidata");
      if (data?.data?.authUrl) {
        console.log("frst api on successuuuuu", data?.data?.authUrl);
        window.location.href = data?.data?.authUrl;
      } else {
        console.log("frst api on errorrrrrrrrr");
        alert("Unable to start Slack login. Please try again.");
      }
    },
    onError: () => {
      alert("Slack login error. Please try again.");
      console.log("on errorr iruku");
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
      console.log(res, "apidata0021");
      console.log("2nd api calleduuuuuuu");
      // if (!res.ok) throw new Error("slack callback failed");
      console.log("2nd api returned responseeuuuuuuuuuuu");
      console.log(res, "ressss002");
      return res.json();
    },
    onSuccess: (data) => {
      console.log(data, "apidata0022");
      if (data?.status === "success") {
        console.log("2nd api succesuuuuuu");
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log(
          "user data stored in loal storageuuuu and need to navigate to dashboard"
        );
        navigate({ to: "/dashboard" });
      }
    },
    onError: (err) => {
      console.log("2nd api on errorrr haii", err);
      navigate({ to: "/" });
    },
  });
  useEffect(() => {
    if (code2) {
      console.log(code2, "code222 vachindeeeee");
      slackCallbackMutation.mutate(code2);
      console.log("hogaya!!!!!!!!");
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
