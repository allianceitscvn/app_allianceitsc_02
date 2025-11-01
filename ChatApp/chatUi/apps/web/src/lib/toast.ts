import toast, { Toaster as HotToaster, ToastOptions } from 'react-hot-toast';

/**
 * Default toast configuration
 */
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#363636',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 16px',
  },
};

/**
 * Toast utility functions for displaying notifications throughout the app
 */
export const Toast = {
  /**
   * Show a success toast message
   * @param message - The success message to display
   * @param options - Optional toast configuration
   */
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      icon: '✅',
      style: {
        ...defaultOptions.style,
        background: '#10b981',
        color: '#fff',
        ...(options?.style || {}),
      },
    });
  },

  /**
   * Show an error toast message
   * @param message - The error message to display
   * @param options - Optional toast configuration
   */
  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      ...defaultOptions,
      duration: 5000, // Show errors a bit longer
      ...options,
      icon: '❌',
      style: {
        ...defaultOptions.style,
        background: '#ef4444',
        color: '#fff',
        ...(options?.style || {}),
      },
    });
  },

  /**
   * Show a warning toast message
   * @param message - The warning message to display
   * @param options - Optional toast configuration
   */
  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: '⚠️',
      style: {
        ...defaultOptions.style,
        background: '#f59e0b',
        color: '#fff',
        ...(options?.style || {}),
      },
    });
  },

  /**
   * Show an info toast message
   * @param message - The info message to display
   * @param options - Optional toast configuration
   */
  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: 'ℹ️',
      style: {
        ...defaultOptions.style,
        background: '#3b82f6',
        color: '#fff',
        ...(options?.style || {}),
      },
    });
  },

  /**
   * Show a loading toast message
   * @param message - The loading message to display
   * @param options - Optional toast configuration
   */
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      ...defaultOptions,
      ...options,
    });
  },

  /**
   * Show a custom toast message
   * @param message - The message to display
   * @param options - Optional toast configuration
   */
  custom: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
    });
  },

  /**
   * Show a promise toast that updates based on promise state
   * @param promise - The promise to track
   * @param messages - Messages for loading, success, and error states
   * @param options - Optional toast configuration
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      messages,
      {
        ...defaultOptions,
        ...options,
      }
    );
  },

  /**
   * Dismiss a specific toast by ID
   * @param toastId - The ID of the toast to dismiss
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all active toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },

  /**
   * Remove a specific toast by ID (alias for dismiss)
   * @param toastId - The ID of the toast to remove
   */
  remove: (toastId?: string) => {
    toast.remove(toastId);
  },
};

/**
 * Toaster component to be added to the app root
 * Export for use in __root.tsx or main.tsx
 */
export { HotToaster as Toaster };

/**
 * Handle API error and show appropriate toast
 * @param error - The error object from API
 * @param defaultMessage - Optional default message if error parsing fails
 */
export const handleApiError = (error: any, defaultMessage?: string) => {
  let errorMessage = defaultMessage || 'An unexpected error occurred';

  if (error?.response?.data) {
    const errorData = error.response.data;
    
    // Handle the specific error format: { error: "NotFoundException", message: "User not found" }
    if (errorData.message) {
      errorMessage = errorData.message;
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }

  Toast.error(errorMessage);
  return errorMessage;
};

/**
 * Handle API success and show appropriate toast
 * @param message - The success message to display
 * @param data - Optional data from API response
 */
export const handleApiSuccess = (message: string, data?: any) => {
  Toast.success(message);
  return data;
};

// Export default for convenience
export default Toast;
