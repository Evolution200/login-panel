import create from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
    username: string;
    role: string;
    setUser: (username: string, role: string) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            username: '',
            role: '',
            setUser: (username, role) => set({ username, role }),
            clearUser: () => set({ username: '', role: '' }),
        }),
        {
            name: 'user-storage',
        }
    )
);