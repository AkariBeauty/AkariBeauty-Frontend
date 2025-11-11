// src/components/UI/Modal.tsx
import React from 'react';
import { X } from '@phosphor-icons/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-bolt-neutral-500 bg-opacity-75" // RENOMEADO AQUI
          onClick={onClose}
        />

        <div className={`inline-block w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-bolt-neutral-900">{title}</h3> {/* RENOMEADO AQUI */}
            <button
              onClick={onClose}
              className="p-1 text-bolt-neutral-400 hover:text-bolt-neutral-600 transition-colors rounded-lg hover:bg-bolt-neutral-100" // RENOMEADO AQUI
            >
              <X size={20} />
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;