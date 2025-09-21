import { toast } from 'sonner';
import { ApiError } from '@/lib/api';

export function useToastNotifications() {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
    });
  };

  const showError = (error: unknown, fallbackMessage = 'An error occurred') => {
    if (error instanceof ApiError) {
      toast.error(error.data?.error || 'API Error', {
        description: error.data?.message || error.message,
      });
    } else if (error instanceof Error) {
      toast.error('Error', {
        description: error.message,
      });
    } else if (typeof error === 'string') {
      toast.error('Error', {
        description: error,
      });
    } else {
      toast.error('Error', {
        description: fallbackMessage,
      });
    }
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
    });
  };

  const showLoading = (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    });
  };

  const dismissToast = (toastId: string | number) => {
    toast.dismiss(toastId);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissToast,
  };
}
