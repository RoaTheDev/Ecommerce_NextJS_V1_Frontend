import {AxiosError, AxiosInstance} from 'axios';
import toast from 'react-hot-toast';

export interface ApiError {
    status: number;
    title: string;
    detail: string;
    instance?: string;
    requestId?: string;
    traceId?: string;
}

export function apiErrorHandler(api: AxiosInstance) {
    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            const apiError = extractApiError(error);
            displayErrorToast(apiError);
            return Promise.reject(apiError);
        }
    );
}

function extractApiError(error: AxiosError): ApiError {
    if (error.response?.data) {
        return error.response.data as ApiError;
    }

    return {
        status: error.response?.status || 500,
        title: 'Error',
        detail: error.message || 'An unexpected error occurred'
    };
}

function displayErrorToast(error: ApiError) {
    switch (error.status) {
        case 400:
            toast.error(error.detail || 'Invalid request');
            break;
        case 401:
            toast.error('Your session has expired. Please log in again.');
            break;
        case 403:
            toast.error("You don't have permission to perform this action.");
            break;
        case 404:
            toast.error(error.detail || 'Resource not found');
            break;
        case 409:
            toast.error(error.detail || 'Conflict with existing data');
            break;
        case 500:
        case 503:
            toast.error('A server error occurred. Our team has been notified.');
            break;
        default:
            toast.error(error.detail || 'An unexpected error occurred');
    }
}