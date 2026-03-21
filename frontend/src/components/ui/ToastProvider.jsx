import React, { createContext, useContext, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const push = useCallback((payload, { type = 'info', timeout = 4000 } = {}) => {
    const item = typeof payload === 'string' ? { title: '', message: payload } : (payload || {});
    const toastType = item.type || type;
    const toastTimeout = item.timeout || timeout;
    const title = item.title || '';
    const message = item.message || item.msg || '';
    const content = title && message ? `${title}: ${message}` : (title || message);

    if (toastType === 'success') return toast.success(content, { duration: toastTimeout });
    if (toastType === 'error') return toast.error(content, { duration: toastTimeout });
    return toast(content, { duration: toastTimeout });
  }, []);

  const remove = useCallback((id) => {
    toast.dismiss(id);
  }, []);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <Toaster
        position="top-center"
        gutter={10}
        containerStyle={{ top: 20 }}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#0f172a'
          }
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
