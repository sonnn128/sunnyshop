import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import Icon from '../AppIcon';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  // push can accept (string) or ({ title, message, type, timeout })
  const push = useCallback((payload, { type = 'info', timeout = 4000 } = {}) => {
    const id = Date.now() + Math.random();
    const item = typeof payload === 'string' ? { title: '', message: payload } : payload || {};
    const t = { id, title: item.title || '', message: item.message || item.msg || '', type: item.type || type, timeout: item.timeout || timeout, createdAt: Date.now() };
    setToasts(arr => [...arr, t]);
    timers.current[id] = setTimeout(() => {
      setToasts(arr => arr.filter(x => x.id !== id));
      delete timers.current[id];
    }, t.timeout);
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
    if (timers.current[id]) { clearTimeout(timers.current[id]); delete timers.current[id]; }
  }, []);

  const pause = (id) => {
    if (timers.current[id]) { clearTimeout(timers.current[id]); delete timers.current[id]; }
  };

  const resume = (id, timeoutLeft) => {
    if (!timers.current[id]) {
      timers.current[id] = setTimeout(() => { setToasts(t => t.filter(x => x.id !== id)); delete timers.current[id]; }, timeoutLeft || 2000);
    }
  };

  const iconFor = (type) => {
    if (type === 'success') return 'CheckCircle';
    if (type === 'error') return 'XCircle';
    if (type === 'warning') return 'AlertTriangle';
    return 'Info';
  };

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
  <div className="fixed right-4 top-6 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast-item flex items-start gap-3 p-3 rounded-lg shadow-xl min-w-[260px] max-w-sm overflow-hidden ${t.type === 'error' ? 'toast-error' : t.type === 'success' ? 'toast-success' : t.type === 'warning' ? 'toast-warning' : 'toast-info'}`}
            onMouseEnter={() => pause(t.id)}
            onMouseLeave={() => resume(t.id, t.timeout)}
          >
            <div className="flex-shrink-0 mt-0.5 toast-icon">
              <Icon name={iconFor(t.type)} size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              {t.title ? <div className="text-[12px] font-semibold text-foreground uppercase tracking-wide">{t.title}</div> : null}
              <div className="text-[11px] text-muted-foreground mt-0.5">{t.message}</div>
              <div className="mt-2.5 h-[2px] bg-slate-100 rounded-full overflow-hidden">
                <div className="toast-progress h-full" style={{ animationDuration: `${t.timeout}ms` }} />
              </div>
            </div>
            <button className="ml-2 text-slate-300 hover:text-slate-600 transition-colors text-xs" onClick={() => remove(t.id)}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
