import axios from "axios";
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const STORAGE_KEYS = {
	USER: "@gabinete:user",
} as const;

interface FailedRequest {
	resolve: (token: string | null) => void;
	reject: (error: Error) => void;
}

export const apiClient: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (window.location.pathname === "/login") {
				return Promise.reject(error);
			}

			if (isRefreshing) {
				return new Promise<string | null>((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => {
						return apiClient(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await apiClient.post("/auth/refresh");

				processQueue(null);
				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError as Error, null);
				handleUnauthorized();
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

function handleUnauthorized() {
	localStorage.removeItem(STORAGE_KEYS.USER);

	if (window.location.pathname !== "/login") {
		window.location.href = "/login";
	}
}
