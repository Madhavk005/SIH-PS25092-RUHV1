const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// Get auth headers with token if available
const getAuthHeaders = (includeToken = true) => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (includeToken) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
};

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: getAuthHeaders(false),
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: getAuthHeaders(false),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }
  return res.json();
}
