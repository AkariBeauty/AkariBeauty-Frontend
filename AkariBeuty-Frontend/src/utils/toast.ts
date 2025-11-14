import { toast } from "sonner";

type ToastPayload = {
  description?: string;
  duration?: number;
};

const DEFAULT_DURATION = 4000;

export const showSuccess = (message: string, options?: ToastPayload) =>
  toast.success(message, { duration: DEFAULT_DURATION, ...options });

export const showError = (message: string, options?: ToastPayload) =>
  toast.error(message, { duration: DEFAULT_DURATION, ...options });

export const showInfo = (message: string, options?: ToastPayload) =>
  toast(message, { duration: DEFAULT_DURATION, ...options });
