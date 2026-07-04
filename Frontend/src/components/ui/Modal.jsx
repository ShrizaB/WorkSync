import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} card shadow-card-lg animate-fade-in`}>
        <div className="flex items-center justify-between p-5 border-b border-warm-100">
          <h3 className="text-base font-bold text-warm-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-warm-100 transition-colors">
            <X size={17} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger', loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-warm-600 text-sm mb-5">{message}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-outline text-sm">Cancel</button>
      <button onClick={onConfirm} disabled={loading} className={`${variant === 'danger' ? 'btn-danger' : 'btn-accent'} text-sm`}>
        {loading ? 'Processing...' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default Modal;
