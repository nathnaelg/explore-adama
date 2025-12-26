declare module 'expo-router' {
  export const router: {
    push: (to: string | unknown) => void;
    replace: (to: string | unknown) => void;
    back: () => void;
  };
}
