import { API } from 'Plugins/CommonUtils/API'
import axios, { isAxiosError } from 'axios'

export const SendPostRequest = async (message:API) => {
    try {
        const response = await axios.post(message.getURL(), JSON.stringify(message), {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response status:', response.status);
        console.log('Response body:', response.data);
        if (response.status === 200) {
            return response
        }
    } catch (error) {
        if (isAxiosError(error)) {
            // Check if the error has a response and a data property
            if (error.response && error.response.data) {
                console.error('Error sending request:', error.response.data);
            } else {
                console.error('Error sending request:', error.message);
            }
        } else {
            console.error('Unexpected error:', error);
        }
    }
};