import React from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4">
        <div className="transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-in">
          <div className="bg-card rounded-lg shadow-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="p-6">{children}</div>
            {footer && <div className="p-4 border-t border-border bg-background">{footer}</div>}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
