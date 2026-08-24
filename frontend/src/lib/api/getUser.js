import { cookies } from "next/headers";
import axios from "axios";
import { API_URL } from "@/lib/api/axios";

export async function getUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  const response = await axios.get(`${API_URL}/user`, {
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
    validateStatus: (status) => status < 500,
  });

  if (response.status === 200) {
    return response.data;
  }

  return null;
}
