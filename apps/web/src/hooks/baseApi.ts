const BACKEND_BASE_URL = "https://dashboard-api.taluspay-staging.com"; // Replace with your actual base URL

export const baseApi = async (endpoint: string, options?: RequestInit) => {
  const url = `${process.env.NEXT_PUBLIC_RISK_RADAR_BASE_URL || BACKEND_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};
