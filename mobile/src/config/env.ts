import Constants from "expo-constants";

export const env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL
    ?? Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL
    ?? "",

  NODE_ENV: process.env.NODE_ENV ?? "development",

  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
    ?? Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
    ?? "",
};
