import { SendPostRequest } from './SendPost';
import { API } from 'Plugins/CommonUtils/API'

export interface Application {
    userName: string;
}

export const fetchApplications = async (message:API)=> {
    try {
        const response = await SendPostRequest(message);

        if (response && response.data) {
            let parsedData: any;
            if (typeof response.data === 'string') {
                parsedData = JSON.parse(response.data);
            } else {
                parsedData = response.data;
            }

            if (Array.isArray(parsedData)) {
                return parsedData;
            } else if (typeof parsedData === 'object' && parsedData !== null) {
                return [parsedData];
            } else {
                throw new Error('Unexpected data format');
            }
        } else {
            throw new Error('No data received');
        }
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        throw error;
    }
};