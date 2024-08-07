import create from 'zustand';
import { SendPostRequest } from '../Common/SendPost';
import { ReadPeriodicalsMessage } from 'Plugins/ManagerAPI/ReadPeriodicalsMessage';
import { EditorFindMessage } from 'Plugins/EditorAPI/EditorFindMessage';

interface Periodical {
    name: string;
    editors: string[];
}

interface PeriodicalStore {
    periodicals: Periodical[];
    totalEditors: number;
    error: string | null;
    loading: boolean;
    fetchPeriodicals: () => Promise<void>;
    fetchEditors: (periodicalName: string) => Promise<void>;
    fetchAllEditorsForPeriodicals: () => Promise<void>;
    setError: (error: string | null) => void;
    calculateTotalEditors: () => void;
}

export const usePeriodicalStore = create<PeriodicalStore>((set, get) => ({
    periodicals: [],
    totalEditors: 0,
    error: null,
    loading: false,

    fetchPeriodicals: async () => {
        set({ loading: true, error: null });
        try {
            const message = new ReadPeriodicalsMessage();
            const response = await SendPostRequest(message);
            if (response && response.data) {
                const periodicalsData = JSON.parse(response.data) as { periodical: string }[];
                const periodicals: Periodical[] = periodicalsData.map(p => ({
                    name: p.periodical,
                    editors: []
                }));
                set({ periodicals, loading: false });
                await get().fetchAllEditorsForPeriodicals();
            }
        } catch (error) {
            console.error('Failed to load periodicals:', error);
            set({ error: 'Failed to load periodicals. Please try again.', loading: false });
        }
    },

    fetchEditors: async (periodicalName: string) => {
        try {
            const message = new EditorFindMessage(periodicalName);
            const response = await SendPostRequest(message);
            if (response && response.data) {
                const editorsData = JSON.parse(response.data) as { userName: string }[];
                const editors = editorsData.map(editor => editor.userName);
                set(state => ({
                    periodicals: state.periodicals.map(p =>
                        p.name === periodicalName ? { ...p, editors } : p
                    )
                }));
            }
        } catch (error) {
            console.error(`Failed to get editors for ${periodicalName}:`, error);
        }
    },

    fetchAllEditorsForPeriodicals: async () => {
        const { periodicals } = get();
        await Promise.all(periodicals.map(p => get().fetchEditors(p.name)));
        get().calculateTotalEditors();
    },

    setError: (error: string | null) => set({ error }),

    calculateTotalEditors: () => {
        const totalEditors = get().periodicals.reduce((sum, periodical) => sum + periodical.editors.length, 0);
        set({ totalEditors });
    },
}));