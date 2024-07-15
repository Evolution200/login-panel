// UserStore.tsx
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Article {
    taskName: string;
    periodicalName: string;
    state: string;
}

type UserState = {
    username: string;
    role: string;
    articles: Article[];
    setUser: (username: string, role: string) => void;
    clearUser: () => void;
    setArticles: (articles: Article[]) => void;
    addArticle: (article: Article) => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            username: '',
            role: '',
            articles: [],
            setUser: (username, role) => set({ username, role }),
            clearUser: () => set({ username: '', role: '', articles: [] }),
            setArticles: (articles) => set({ articles }),
            addArticle: (article) => set((state) => ({ articles: [...state.articles, article] })),
        }),
        {
            name: 'user-storage',
        }
    )
);