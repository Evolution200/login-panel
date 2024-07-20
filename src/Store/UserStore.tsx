// UserStore.tsx
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { sha256 } from 'js-sha256';

export enum UserRole {
    SuperUser = 'superuser',
    Manager = 'manager',
    Editor = 'editor',
    User = 'user'
}

interface Article {
     taskName: string,
     periodicalName: string,
     state: string
}

const generateSalt = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

interface UserState {
    username: string;
    role: UserRole | '';
    articles: Article[];
    salt: string;
    setUser: (username: string, role: UserRole) => void;
    clearUser: () => void;
    setArticles: (articles: Article[]) => void;
    addArticle: (article: Article) => void;
    hashPassword: (password: string) => string;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            username: '',
            role: '',
            articles: [],
            salt: generateSalt(),
            setUser: (username, role) => set({ username, role }),
            clearUser: () => set({ username: '', role: '', articles: [], salt: generateSalt() }),
            setArticles: (articles) => set({ articles }),
            addArticle: (article) => set((state) => ({ articles: [...state.articles, article] })),
            hashPassword: (password) => sha256(password + get().salt),
        }),
        {
            name: 'user-storage',
        }
    )
);