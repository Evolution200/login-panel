import create from 'zustand';
import { Application, fetchApplications } from '../Common/FetchApplication';
import { ReadTasksMessage } from 'Plugins/ManagerAPI/ReadTasksMessage';
import { usePeriodicalStore } from './PeriodicalStore';

interface ManagerState {
    pendingApplications: Application[];
    stats: {
        totalPeriodicals: number;
        totalEditors: number;
        pendingApplications: number;
    };
    loadPendingApplications: () => Promise<void>;
    updateStats: () => void;
}

export const useManagerStore = create<ManagerState>((set, get) => ({
    pendingApplications: [],
    stats: {
        totalPeriodicals: 0,
        totalEditors: 0,
        pendingApplications: 0,
    },
    loadPendingApplications: async () => {
        try {
            const message = new ReadTasksMessage();
            const applications = await fetchApplications(message);
            set({
                pendingApplications: applications,
                stats: {
                    ...get().stats,
                    pendingApplications: applications.length,
                },
            });
        } catch (error) {
            console.error('Failed to load pending applications:', error);
        }
    },
    updateStats: () => {
        const { periodicals, totalEditors } = usePeriodicalStore.getState();
        set({
            stats: {
                totalPeriodicals: periodicals.length,
                totalEditors: totalEditors,
                pendingApplications: get().pendingApplications.length,
            },
        });
    },
}));