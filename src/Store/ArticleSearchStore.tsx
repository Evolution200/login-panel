// ArticleSearchStore.tsx
import create from 'zustand';
import { SendPostRequest } from '../Common/SendPost';
import { ReadPeriodicalTaskListMessage } from 'Plugins/TaskAPI/ReadPeriodicalTaskListMessage';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';
import { ReadTaskAuthorMessage } from 'Plugins/TaskAPI/ReadTaskAuthorMessage';
import { FetchPeriodicals } from '../Common/FetchPeriodicals';
import { SearchTaskMessage } from 'Plugins/TaskAPI/SearchTaskMessage';

interface Article {
    taskName: string;
    periodicalName: string;
    state: string;
    authors: string[];
}

interface ArticleSearchStore {
    periodicals: string[];
    articles: Article[];
    loading: boolean;
    error: string | null;
    fetchPeriodicals: () => Promise<void>;
    fetchArticlesByPeriodical: (periodical: string) => Promise<void>;
    searchArticlesByName: (articleName: string) => Promise<void>;
    setArticles: (articles: Article[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetSearch: () => void;
}

export const useArticleSearchStore = create<ArticleSearchStore>((set, get) => ({
    periodicals: [],
    articles: [],
    loading: false,
    error: null,

    fetchPeriodicals: async () => {
        set({ loading: true, error: null });
        try {
            const periodicals = await FetchPeriodicals();
            set({ periodicals, loading: false });
        } catch (error) {
            console.error('Failed to fetch periodicals:', error);
            set({ error: 'Failed to load periodicals. Please try again.', loading: false });
        }
    },

    fetchArticlesByPeriodical: async (periodical: string) => {
        set({ loading: true, error: null });
        try {
            const taskListMessage = new ReadPeriodicalTaskListMessage(periodical);
            const taskListResponse = await SendPostRequest(taskListMessage);

            if (taskListResponse && taskListResponse.data) {
                const tasksData = JSON.parse(taskListResponse.data) as { taskName: string }[];
                const articles: Article[] = [];

                for (const taskData of tasksData) {
                    const [stateResponse, authorsResponse] = await Promise.all([
                        SendPostRequest(new ReadTaskInfoMessage(taskData.taskName, 'state')),
                        SendPostRequest(new ReadTaskAuthorMessage(taskData.taskName))
                    ]);

                    const state = stateResponse.data || '';
                    const authorsData = JSON.parse(authorsResponse.data) as { userName: string }[];
                    const authors = authorsData.map(author => author.userName);

                    articles.push({
                        taskName: taskData.taskName,
                        periodicalName: periodical,
                        state,
                        authors
                    });
                }

                set({ articles, loading: false });
            } else {
                set({ error: 'Invalid response from server.', loading: false });
            }
        } catch (error) {
            console.error('Failed to load articles by periodical:', error);
            set({ error: 'Failed to load articles. Please try again.', loading: false });
        }
    },

    searchArticlesByName: async (articleName: string) => {
        set({ loading: true, error: null });
        try {
            const searchMessage = new SearchTaskMessage(articleName);
            const response = await SendPostRequest(searchMessage);

            if (response && response.data) {
                const searchResults = JSON.parse(response.data) as { taskName: string }[];
                const articles: Article[] = [];

                for (const result of searchResults) {
                    const [periodicalResponse, stateResponse, authorsResponse] = await Promise.all([
                        SendPostRequest(new ReadTaskInfoMessage(result.taskName, 'task_periodical')),
                        SendPostRequest(new ReadTaskInfoMessage(result.taskName, 'state')),
                        SendPostRequest(new ReadTaskAuthorMessage(result.taskName))
                    ]);

                    const periodicalName = periodicalResponse.data || '';
                    const state = stateResponse.data || '';
                    const authorsData = JSON.parse(authorsResponse.data) as { userName: string }[];
                    const authors = authorsData.map(author => author.userName);

                    articles.push({
                        taskName: result.taskName,
                        periodicalName,
                        state,
                        authors
                    });
                }

                set({ articles, loading: false });
            } else {
                set({ error: 'No results found', loading: false });
            }
        } catch (error) {
            console.error('Failed to search articles:', error);
            set({ error: 'Failed to search articles. Please try again.', loading: false });
        }
    },

    setArticles: (articles: Article[]) => set({ articles }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),

    resetSearch: () => {
        set({
            articles: [],
            error: null,
            loading: false
        });
    },
}));