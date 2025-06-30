// src/pages/Client/Booking/steps/BookingConfirmation.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, Calendar, Clock, User, Scissors, CurrencyDollar } from '@phosphor-icons/react';
import { BookingData } from '../../../../types'; // Verifique o caminho aqui
import LoadingSpinner from '../../../../components/UI/LoadingSpinner'; // Verifique o caminho aqui

interface BookingConfirmationProps {
  bookingData: BookingData;
  onConfirm: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ bookingData, onConfirm }) => {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 2000));
    onConfirm();
  };

  const { service, professional, date, time } = bookingData;

  if (!service || !professional || !date || !time) {
    return (
      <div className="text-center py-8">
        <p className="text-bolt-neutral-500">Dados incompletos para confirmação</p> {/* RENOMEADO AQUI */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Confirmar agendamento</h2> {/* RENOMEADO AQUI */}
        <p className="text-bolt-neutral-600">Revise os detalhes antes de confirmar</p> {/* RENOMEADO AQUI */}
      </div>

      {/* Detalhes do agendamento */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-bolt-neutral-900 mb-4">Detalhes do agendamento</h3> {/* RENOMEADO AQUI */}

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl"> {/* RENOMEADO AQUI */}
            <div className="w-12 h-12 bg-gradient-to-br from-bolt-primary-400 to-bolt-primary-600 rounded-xl flex items-center justify-center mr-4"> {/* RENOMEADO AQUI */}
              <Scissors size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-medium text-bolt-neutral-900">{service.name}</h4> {/* RENOMEADO AQUI */}
              <p className="text-sm text-bolt-neutral-600">{service.description}</p> {/* RENOMEADO AQUI */}
            </div>
          </div>

          <div className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl"> {/* RENOMEADO AQUI */}
            <div className="w-12 h-12 bg-gradient-to-br from-bolt-secondary-400 to-bolt-secondary-600 rounded-xl flex items-center justify-center mr-4"> {/* RENOMEADO AQUI */}
              <User size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-medium text-bolt-neutral-900">{professional.name}</h4> {/* RENOMEADO AQUI */}
              <p className="text-sm text-bolt-neutral-600">Profissional especializado</p> {/* RENOMEADO AQUI */}
            </div>
          </div>

          <div className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl"> {/* RENOMEADO AQUI */}
            <div className="w-12 h-12 bg-gradient-to-br from-bolt-accent-400 to-bolt-accent-600 rounded-xl flex items-center justify-center mr-4"> {/* RENOMEADO AQUI */}
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-medium text-bolt-neutral-900"> {/* RENOMEADO AQUI */}
                {format(new Date(date), "EEEE, d 'de' MMMM")}
              </h4>
              <p className="text-sm text-bolt-neutral-600">Data do agendamento</p> {/* RENOMEADO AQUI */}
            </div>
          </div>

          <div className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl"> {/* RENOMEADO AQUI */}
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mr-4"> {/* Mantido 'pink' */}
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-medium text-bolt-neutral-900">{time}</h4> {/* RENOMEADO AQUI */}
              <p className="text-sm text-bolt-neutral-600">Duração: {service.duration} minutos</p> {/* RENOMEADO AQUI */}
            </div>
          </div>
        </div>
      </div>

      {/* Valor total */}
      <div className="bg-gradient-to-br from-bolt-primary-50 to-bolt-secondary-50 rounded-2xl p-6"> {/* RENOMEADO AQUI */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <CurrencyDollar size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-bolt-neutral-900">Valor total</h3> {/* RENOMEADO AQUI */}
              <p className="text-sm text-bolt-neutral-600">Pagamento no local</p> {/* RENOMEADO AQUI */}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-bolt-primary-600">R$ {service.price}</p> {/* RENOMEADO AQUI */}
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-bolt-neutral-900 mb-4">Observações (opcional)</h3> {/* RENOMEADO AQUI */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Alguma observação especial para o profissional?"
          className="w-full p-4 border border-bolt-neutral-300 rounded-xl input-focus resize-none" // RENOMEADO AQUI
          rows={3}
        />
      </div>

      {/* Botão de confirmação */}
      <button
        onClick={handleConfirm}
        disabled={isLoading}
        className="w-full btn-primary text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" color="text-white" />
            <span className="ml-2">Confirmando...</span>
          </>
        ) : (
          'Confirmar Agendamento'
        )}
      </button>

      {/* Política de cancelamento */}
      <div className="bg-bolt-yellow-50 border border-bolt-yellow-200 rounded-xl p-4"> {/* RENOMEADO AQUI */}
        <h4 className="font-medium text-bolt-yellow-800 mb-2">Política de cancelamento</h4> {/* RENOMEADO AQUI */}
        <p className="text-sm text-bolt-yellow-700"> {/* RENOMEADO AQUI */}
          Cancelamentos podem ser feitos até 2 horas antes do horário agendado. Cancelamentos em cima da hora podem estar sujeitos a taxas.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;