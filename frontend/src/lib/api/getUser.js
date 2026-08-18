import { AxiosReq } from "./server-api";

export async function getUser() {
  try {
    const api = await AxiosReq();
    const res = await api.get("/user");
    return res.data;
  } catch (error) {
    return null;
  }
}


