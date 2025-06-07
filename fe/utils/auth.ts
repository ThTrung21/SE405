import { useAppStore } from "../stores/useAppStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useCartStore } from "../stores/useCartStore";
import axios from "axios";

export const logOut = () => {
  const setIsLoading = useAppStore.getState().setIsLoading;
  const reset = useAuthStore.getState().reset;
  const resetCart = useCartStore.getState().reset;

  setIsLoading(true);
  reset();
  resetCart();
  setIsLoading(false);
};

export const getAccessToken = () => {
  return useAuthStore.getState().token.accessToken;
};

export const getRefreshToken = () => {
  return useAuthStore.getState().token.refreshToken;
};

export const handleRefreshToken = async () => {
  const refreshToken = getRefreshToken();
  const { data } = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      timeout: 20000,
    }
  );

  const newToken = data.data.token;
  const setToken = useAuthStore.getState().setToken;
  setToken({ refreshToken, accessToken: newToken });
  return newToken;
};
