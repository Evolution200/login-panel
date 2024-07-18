// ArticleSearchStore.tsx
import create from 'zustand';
import { SendPostRequest } from '../Common/SendPost';
import { ReadPeriodicalTaskListMessage } from 'Plugins/TaskAPI/ReadPeriodicalTaskListMessage';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';
import { ReadTaskAuthorMessage } from 'Plugins/TaskAPI/ReadTaskAuthorMessage';
import { FetchPeriodicals } from '../Common/FetchPeriodicals';
import { ReadTaskListMessage } from 'Plugins/TaskAPI/ReadTaskListMessage';

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
    fetchArticlesByAuthor: (author: string) => Promise<void>;
    setError: (error: string | null) => void;
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

    fetchArticlesByAuthor: async (author: string) => {
        set({ loading: true, error: null });
        try {
            const taskListMessage = new ReadTaskListMessage(author);
            const taskListResponse = await SendPostRequest(taskListMessage);

            if (taskListResponse && taskListResponse.data) {
                const tasksData = JSON.parse(taskListResponse.data) as { taskName: string }[];
                const articles: Article[] = [];

                for (const taskData of tasksData) {
                    const [periodicalResponse, stateResponse, authorsResponse] = await Promise.all([
                        SendPostRequest(new ReadTaskInfoMessage(taskData.taskName, 'task_periodical')),
                        SendPostRequest(new ReadTaskInfoMessage(taskData.taskName, 'state')),
                        SendPostRequest(new ReadTaskAuthorMessage(taskData.taskName))
                    ]);

                    const periodical = periodicalResponse.data || '';
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
            console.error('Failed to load articles by author:', error);
            set({ error: 'Failed to load articles. Please try again.', loading: false });
        }
    },

    setError: (error: string | null) => set({ error }),
}));