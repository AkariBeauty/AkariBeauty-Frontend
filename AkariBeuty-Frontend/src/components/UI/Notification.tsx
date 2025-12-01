// src/components/UI/Notification.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, WarningCircle, Info } from '@phosphor-icons/react';
import { NotificationProps } from '../../types'; // Importe do seu arquivo de types

const Notification: React.FC<NotificationProps> = ({ type, message, isVisible, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 3000); // Notificação some após 3 segundos
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, onClose]);

  const notificationClasses = {
    success: 'bg-bolt-green-50 text-bolt-green-700 border-bolt-green-200', // RENOMEADO AQUI
    error: 'bg-bolt-red-50 text-bolt-red-700 border-bolt-red-200',     // RENOMEADO AQUI
    warning: 'bg-bolt-yellow-50 text-bolt-yellow-700 border-bolt-yellow-200', // RENOMEADO AQUI
    info: 'bg-blue-50 text-blue-700 border-blue-200', // Manter se você tem um 'blue' na sua paleta, ou ajustar
  };

  const iconMap = {
    success: <CheckCircle size={20} weight="fill" />,
    error: <XCircle size={20} weight="fill" />,
    warning: <WarningCircle size={20} weight="fill" />,
    info: <Info size={20} weight="fill" />,
  };

  if (!show) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-xl shadow-lg border ${notificationClasses[type]}`}>
      <div className="mr-3">{iconMap[type]}</div>
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setShow(false);
          onClose();
        }}
        className="ml-4 p-1 rounded-md text-bolt-neutral-600 hover:bg-bolt-neutral-100 hover:text-bolt-neutral-900 transition-colors" // RENOMEADO AQUI
      >
        <XCircle size={16} />
      </button>
    </div>
  );
};

export default Notification;