// UserTaskStore.tsx
import create from 'zustand';
import { SendPostRequest } from '../Common/SendPost';
import { ReadTaskListMessage } from 'Plugins/TaskAPI/ReadTaskListMessage';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';
import { CheckTaskIdentityMessage } from 'Plugins/TaskAPI/CheckTaskIdentityMessage';

export class UserTask {
    taskName: string;
    periodicalName: string;
    state: string;
}

interface UserTaskStore {
    authorTasks: UserTask[];
    reviewerTasks: UserTask[];
    error: string | null;
    loading: boolean;
    fetchTasks: (userName: string) => Promise<void>;
    setError: (error: string | null) => void;
}

export const useUserTaskStore = create<UserTaskStore>((set) => ({
    authorTasks: [],
    reviewerTasks: [],
    error: null,
    loading: false,

    fetchTasks: async (userName: string) => {
        set({ loading: true, error: null });
        try {
            const taskListMessage = new ReadTaskListMessage(userName);
            const taskListResponse = await SendPostRequest(taskListMessage);
            console.log("Raw task list response:", taskListResponse);

            if (taskListResponse && taskListResponse.data) {
                try {
                    const tasksData = JSON.parse(taskListResponse.data) as { taskName: string }[];
                    const authorTasks: UserTask[] = [];
                    const reviewerTasks: UserTask[] = [];

                    for (const taskData of tasksData) {
                        // 获取periodicalName
                        const periodicalMessage = new ReadTaskInfoMessage(taskData.taskName, 'task_periodical');
                        const periodicalResponse = await SendPostRequest(periodicalMessage);
                        const periodical = periodicalResponse.data || '';

                        // 获取state
                        const stateMessage = new ReadTaskInfoMessage(taskData.taskName, 'state');
                        const stateResponse = await SendPostRequest(stateMessage);
                        const state = stateResponse.data || '';

                        // 检查用户身份
                        const identityMessage = new CheckTaskIdentityMessage(taskData.taskName, userName);
                        const identityResponse = await SendPostRequest(identityMessage);
                        const identity = identityResponse.data;

                        const task = {
                            taskName: taskData.taskName,
                            periodicalName: periodical,
                            state: state
                        };

                        if (identity === 'author') {
                            authorTasks.push(task);
                        } else if (identity === 'reviewer') {
                            reviewerTasks.push(task);
                        }
                    }

                    set({ authorTasks, reviewerTasks, loading: false });
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError);
                    set({ error: 'Invalid data format received from server.', loading: false });
                }
            } else {
                console.error("Invalid or empty response:", taskListResponse);
                set({ error: 'Invalid response from server.', loading: false });
            }
        } catch (error) {
            console.error('Failed to load user tasks:', error);
            set({ error: 'Failed to load user tasks. Please try again.', loading: false });
        }
    },

    setError: (error: string | null) => set({ error }),
}));