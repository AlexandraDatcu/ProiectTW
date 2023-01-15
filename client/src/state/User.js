import { useMemo } from 'react';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const tokenKey = "jwt";
export const useUserStore = create(
  persist(
    (set) => ({
      jwt: localStorage.getItem(tokenKey),
      setJwt: (newJwt) => set({ jwt: newJwt }),
    }),
    {
      name: 'transport-storage'
    }
  )
);

export function useUserJwt() {
    return useUserStore((state) => state.jwt);
}

export function useUserName() {
    const jwt = useUserJwt();
    return useMemo(() => jwt && JSON.parse(atob(jwt.split(".")[1])).username, [jwt]);
}
