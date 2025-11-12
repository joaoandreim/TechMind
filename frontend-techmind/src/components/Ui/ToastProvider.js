'use client';
import { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const show = (message, severity = 'success') => setToast({ open: true, message, severity });
  const close = () => setToast((t) => ({ ...t, open: false }));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={close}>
        <Alert onClose={close} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);