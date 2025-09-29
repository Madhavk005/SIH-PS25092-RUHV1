interface MoodEntry {
  score: number;
  note?: string;
}

interface MoodStats {
  average: number;
  count: number;
  highest: number;
  lowest: number;
  history: Array<{
    _id: string;
    score: number;
    note?: string;
    timestamp: string;
  }>;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export async function trackMood(
  data: MoodEntry
): Promise<{ success: boolean; data: any }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE}/api/mood`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to track mood");
  }

  return response.json();
}

export async function getMoodHistory(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<{ success: boolean; data: any[] }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const response = await fetch(`${API_BASE}/api/mood/history?${queryParams.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch mood history");
  }

  return response.json();
}

export async function getMoodStats(
  period: "week" | "month" | "year" = "week"
): Promise<{
  success: boolean;
  data: MoodStats;
}> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE}/api/mood/stats?period=${period}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch mood statistics");
  }

  return response.json();
}
