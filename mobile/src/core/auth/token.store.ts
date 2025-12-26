import * as SecureStore from "expo-secure-store";

export const tokenStore = {
  access: () => SecureStore.getItemAsync("access"),
  refresh: () => SecureStore.getItemAsync("refresh"),
  set: async (a: string, r: string) => {
    await SecureStore.setItemAsync("access", a);
    await SecureStore.setItemAsync("refresh", r);
  },
  clear: async () => {
    await SecureStore.deleteItemAsync("access");
    await SecureStore.deleteItemAsync("refresh");
  },
};
