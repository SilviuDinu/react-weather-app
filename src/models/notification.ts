export interface Notification {
    message: string,
    isVisible: boolean,
    severity: 'error' | 'info' | 'success' | 'warning' | string
}