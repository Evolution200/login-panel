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

// const generateSalt = (): string => {
//     return 'FixedSaltValueForSocraticReviewSystem2024';
// };

interface UserState {
    username: string;
    role: UserRole | '';
    articles: Article[];
    // salt: string;
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
            // salt: generateSalt(),
            setUser: (username, role) => set({ username, role }),
            clearUser: () => set({ username: '', role: '', articles: [] }),
            setArticles: (articles) => set({ articles }),
            addArticle: (article) => set((state) => ({ articles: [...state.articles, article] })),
            hashPassword: (password) => sha256(password), // 移除了加盐部分
        }),
        {
            name: 'user-storage',
        }
    )
);