import { ReadPeriodicalsMessage } from 'Plugins/ManagerAPI/ReadPeriodicalsMessage';
import { SendPostRequest } from './SendPost';

export async function FetchPeriodicals(): Promise<string[]> {
    try {
        const message = new ReadPeriodicalsMessage();
        const response = await SendPostRequest(message);
        if (response && response.data) {
            const periodicalsData = JSON.parse(response.data);
            if (Array.isArray(periodicalsData)) {
                return periodicalsData.map(item => item.periodical);
            } else {
                throw new Error('Unexpected data format');
            }
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch periodicals:', error);
        throw error;
    }
}