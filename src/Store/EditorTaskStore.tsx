// EditorTaskStore.tsx
import create from 'zustand';
import { SendPostRequest } from '../Common/SendPost';
import { ReadPeriodicalTaskListMessage } from 'Plugins/TaskAPI/ReadPeriodicalTaskListMessage';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';
import { ReadTaskAuthorMessage } from 'Plugins/TaskAPI/ReadTaskAuthorMessage';
import { EditorReadInfoMessage } from 'Plugins/EditorAPI/EditorReadInfoMessage';

interface EditorTask {
    taskName: string;
    periodicalName: string;
    state: string;
    authors: string[];
}

interface EditorTaskStore {
    tasks: EditorTask[];
    editorPeriodical: string;
    error: string | null;
    loading: boolean;
    fetchEditorPeriodical: (userName: string) => Promise<void>;
    fetchTasks: () => Promise<void>;
    setError: (error: string | null) => void;
}

export const useEditorTaskStore = create<EditorTaskStore>((set, get) => ({
    tasks: [],
    editorPeriodical: '',
    error: null,
    loading: false,

    fetchEditorPeriodical: async (userName: string) => {
        set({ loading: true, error: null });
        try {
            const response = await SendPostRequest(new EditorReadInfoMessage(userName, 'periodical'));
            set({ editorPeriodical: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching editor periodical:', error);
            set({ error: 'Failed to load editor periodical. Please try again later.', loading: false });
        }
    },

    fetchTasks: async () => {
        const { editorPeriodical } = get();
        if (!editorPeriodical) {
            set({ error: 'Editor periodical not set.', loading: false });
            return;
        }

        set({ loading: true, error: null });
        try {
            const taskListMessage = new ReadPeriodicalTaskListMessage(editorPeriodical);
            const taskListResponse = await SendPostRequest(taskListMessage);

            if (taskListResponse && taskListResponse.data) {
                const tasksData = JSON.parse(taskListResponse.data) as { taskName: string }[];
                const tasks: EditorTask[] = [];

                for (const taskData of tasksData) {
                    const [stateResponse, authorsResponse] = await Promise.all([
                        SendPostRequest(new ReadTaskInfoMessage(taskData.taskName, 'state')),
                        SendPostRequest(new ReadTaskAuthorMessage(taskData.taskName))
                    ]);

                    const state = stateResponse.data || '';
                    const authorsData = JSON.parse(authorsResponse.data) as { userName: string }[];
                    const authors = authorsData.map(author => author.userName);

                    tasks.push({
                        taskName: taskData.taskName,
                        periodicalName: editorPeriodical,
                        state,
                        authors
                    });
                }

                set({ tasks, loading: false });
            } else {
                set({ error: 'Invalid response from server.', loading: false });
            }
        } catch (error) {
            console.error('Failed to load editor tasks:', error);
            set({ error: 'Failed to load editor tasks. Please try again.', loading: false });
        }
    },

    setError: (error: string | null) => set({ error }),
}));