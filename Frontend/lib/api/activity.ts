interface ActivityEntry {
  type: string;
  name: string;
  description?: string;
  duration?: number;
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

export async function logActivity(
  data: ActivityEntry
): Promise<{ success: boolean; data: any }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE}/api/activity`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to log activity");
  }

  return response.json();
}
