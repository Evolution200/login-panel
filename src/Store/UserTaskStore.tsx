// UserTaskStore.tsx
import create from 'zustand';
import { SendPostRequest } from '../Common/SendPost';
import { ReadTaskListMessage } from 'Plugins/TaskAPI/ReadTaskListMessage';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';

interface UserTask {
    taskName: string;
    periodicalName: string;
    state: string;
}

interface UserTaskStore {
    tasks: UserTask[];
    error: string | null;
    loading: boolean;
    fetchTasks: (userName: string) => Promise<void>;
    setError: (error: string | null) => void;
}

export const useUserTaskStore = create<UserTaskStore>((set) => ({
    tasks: [],
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
                    const tasks: UserTask[] = [];

                    for (const taskData of tasksData) {
                        // 获取periodicalName
                        const periodicalMessage = new ReadTaskInfoMessage(taskData.taskName, 'task_periodical');
                        const periodicalResponse = await SendPostRequest(periodicalMessage);
                        console.log("Raw periodical response:", periodicalResponse);
                        const periodical = periodicalResponse.data || '';

                        // 获取state
                        const stateMessage = new ReadTaskInfoMessage(taskData.taskName, 'state');
                        const stateResponse = await SendPostRequest(stateMessage);
                        console.log("Raw state response:", stateResponse);
                        const state = stateResponse.data || '';

                        tasks.push({
                            taskName: taskData.taskName,
                            periodicalName: periodical,
                            state: state
                        });
                    }

                    set({ tasks, loading: false });
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError);
                    console.error("Failed data:", taskListResponse.data);
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