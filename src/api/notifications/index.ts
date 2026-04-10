export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  readAt: string | null;
  createdAt: string;
  userId: string;
}

export interface ListNotificationsParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface ListNotificationsResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
