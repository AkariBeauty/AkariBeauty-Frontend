// src/pages/Client/Booking/steps/DateTimeSelection.tsx
import React, { useState } from 'react';
import { format, addDays, isSameDay, isToday, isBefore } from 'date-fns';
import { Calendar, Clock } from '@phosphor-icons/react';
import { Service, Professional } from '../../../../types'; // Verifique o caminho aqui

interface DateTimeSelectionProps {
  selectedService: Service;
  selectedProfessional: Professional;
  onDateTimeSelect: (date: string, time: string) => void;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedService,
  selectedProfessional,
  onDateTimeSelect
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Gerar próximos 14 dias
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };

  // Horários disponíveis (simulado - conectar com sua API)
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  const dates = generateDates();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onDateTimeSelect(format(selectedDate, 'yyyy-MM-dd'), time);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Desabilitar domingos e datas passadas (um dia antes do dia atual)
    return date.getDay() === 0 || isBefore(date, new Date(new Date().setHours(0,0,0,0)));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Escolha data e horário</h2> {/* RENOMEADO AQUI */}
        <div className="text-sm text-bolt-neutral-600"> {/* RENOMEADO AQUI */}
          <p><span className="font-medium">{selectedService.name}</span> com <span className="font-medium">{selectedProfessional.name}</span></p>
          <p>Duração: {selectedService.duration} minutos</p>
        </div>
      </div>

      {/* Seleção de Data */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <Calendar size={20} className="text-bolt-primary-600 mr-2" /> {/* RENOMEADO AQUI */}
          <h3 className="text-lg font-semibold text-bolt-neutral-900">Selecione a data</h3> {/* RENOMEADO AQUI */}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dates.map((date, index) => {
            const isDisabled = isDateDisabled(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);

            return (
              <button
                key={index}
                onClick={() => !isDisabled && handleDateSelect(date)}
                disabled={isDisabled}
                className={`p-3 rounded-xl text-center transition-all ${
                  isDisabled
                    ? 'bg-bolt-neutral-100 text-bolt-neutral-400 cursor-not-allowed' // RENOMEADO AQUI
                    : isSelected
                    ? 'bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 text-white shadow-lg' // RENOMEADO AQUI
                    : 'bg-bolt-neutral-50 text-bolt-neutral-700 hover:bg-bolt-primary-50 hover:text-bolt-primary-700' // RENOMEADO AQUI
                }`}
              >
                <div className="text-xs font-medium">
                  {format(date, 'EEE')}
                </div>
                <div className="text-lg font-bold">
                  {format(date, 'd')}
                </div>
                {isToday(date) && (
                  <div className="text-xs text-bolt-primary-600 font-medium">Hoje</div> // RENOMEADO AQUI
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seleção de Horário */}
      {selectedDate && (
        <div className="bg-white rounded-2xl p-6 shadow-sm animate-slide-up">
          <div className="flex items-center mb-4">
            <Clock size={20} className="text-bolt-primary-600 mr-2" /> {/* RENOMEADO AQUI */}
            <h3 className="text-lg font-semibold text-bolt-neutral-900">Selecione o horário</h3> {/* RENOMEADO AQUI */}
          </div>

          <div className="text-sm text-bolt-neutral-600 mb-4"> {/* RENOMEADO AQUI */}
            {format(selectedDate, "EEEE, d 'de' MMMM")}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`p-3 rounded-xl text-center font-medium transition-all ${
                  selectedTime === time
                    ? 'bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 text-white shadow-lg' // RENOMEADO AQUI
                    : 'bg-bolt-neutral-50 text-bolt-neutral-700 hover:bg-bolt-primary-50 hover:text-bolt-primary-700' // RENOMEADO AQUI
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resumo */}
      {selectedDate && selectedTime && (
        <div className="bg-gradient-to-br from-bolt-primary-50 to-bolt-secondary-50 rounded-2xl p-6 animate-slide-up"> {/* RENOMEADO AQUI */}
          <h3 className="font-semibold text-bolt-neutral-900 mb-3">Resumo do agendamento</h3> {/* RENOMEADO AQUI */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Serviço:</span> {/* RENOMEADO AQUI */}
              <span className="font-medium">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Profissional:</span> {/* RENOMEADO AQUI */}
              <span className="font-medium">{selectedProfessional.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Data:</span> {/* RENOMEADO AQUI */}
              <span className="font-medium">
                {format(selectedDate, "d 'de' MMMM")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Horário:</span> {/* RENOMEADO AQUI */}
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Duração:</span> {/* RENOMEADO AQUI */}
              <span className="font-medium">{selectedService.duration} min</span>
            </div>
            <div className="flex justify-between border-t border-bolt-neutral-200 pt-2 mt-3"> {/* RENOMEADO AQUI */}
              <span className="text-bolt-neutral-600">Valor:</span> {/* RENOMEADO AQUI */}
              <span className="font-bold text-lg text-bolt-primary-600">R$ {selectedService.price}</span> {/* RENOMEADO AQUI */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;