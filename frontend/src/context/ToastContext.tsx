import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info'; }

interface ToastCtx { show: (msg: string, type?: Toast['type']) => void; }

const Ctx = createContext<ToastCtx>({ show: () => {} });

export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'} {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
