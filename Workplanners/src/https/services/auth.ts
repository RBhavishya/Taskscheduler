import { $fetch } from "../fetch";
import { SlackAuthResponse, SlackCallbackResponse } from "@/lib/interfaces/auth";

//  Start Slack Login (fetches auth URL)
export const slackAuthAPI = async (): Promise<SlackAuthResponse> => {
  try {
    const response = await $fetch.get("/auth/slack");
    return response as SlackAuthResponse;
  } catch (error) {
    throw error;
  }
};

//  Slack Callback (exchange code for user + tokens)
export const slackCallbackAPI = async (code: string): Promise<SlackCallbackResponse> => {
  try {
    const response = await $fetch.get(`/auth/slack/callback`, { code });
    return response as SlackCallbackResponse;
  } catch (error) {
    throw error;
  }
};
