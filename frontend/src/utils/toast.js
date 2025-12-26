import toast from 'react-hot-toast';

/**
 * Toast utility functions with consistent styling
 */

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      ...options,
    });
  },

  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred',
    });
  },

  custom: (message, options = {}) => {
    toast(message, {
      ...options,
    });
  },

  dismiss: toastId => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};
