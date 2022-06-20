import { AxiosInstance } from "axios";

export const getCurrentUser = async (client: AxiosInstance) => {
  const res = await client.get("/api/users/currentuser");

  return res.data.currentUser;
};
