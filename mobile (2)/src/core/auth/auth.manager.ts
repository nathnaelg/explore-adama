//import { authApi } from "@/features/auth/api";
import { tokenStore } from "./token.store";

export const authManager = {
  login: async (email: string, password: string) => {
   // const { data } = await authApi.login(email, password);
    //await tokenStore.set(data.accessToken, data.refreshToken);
    //return data.user;
  },

  logout: async () => {
    await tokenStore.clear();
  },
};
