export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }
  return res.json();
}
