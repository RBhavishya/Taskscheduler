export interface SlackAuthResponse {
  success: boolean;
  status: number;
  data: {
    authUrl: string;
  };
  message?: string;
}

export interface SlackCallbackResponse {
  success: boolean;
  status: number;
  data: {
    user: {
      id: number;
      name: string;
      email?: string;
    };
    token: {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    };
  };
  message?: string;
}
