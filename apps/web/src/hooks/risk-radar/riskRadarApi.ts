const RISK_RADAR_BASE_URL = "https://dashboard-api.taluspay-staging.com"; // Replace with your actual base URL

export const riskRadarApi = async (endpoint: string, options?: RequestInit) => {
  const url = `${process.env.RISK_RADAR_BASE_URL || RISK_RADAR_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};
