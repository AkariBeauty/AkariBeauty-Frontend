// src/pages/Client/Booking/steps/DateTimeSelection.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { Calendar, Clock } from '@phosphor-icons/react';
import { Service, Professional } from '../../../../types';
import { availabilityService, type AvailabilityDay } from '../../../../services/availabilityService';
import LoadingSpinner from '../../../../components/UI/LoadingSpinner';
import { showError } from '../../../../utils/toast';

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
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };
  const dates = generateDates();

  const availabilityMap = useMemo(() => {
    const map = new Map<string, string[]>();
    availability.forEach((day) => {
      map.set(day.date, day.slots);
    });
    return map;
  }, [availability]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedService?.id) return;
      try {
        setIsLoading(true);
        setHasError(false);
        const today = new Date();
        const startDate = format(today, 'yyyy-MM-dd');
        const endDate = format(addDays(today, 13), 'yyyy-MM-dd');

        const data = await availabilityService.fetch({
          servicoId: selectedService.id,
          profissionalId: selectedProfessional?.id,
          startDate,
          endDate,
        });

        const availableKeys = new Set(data.map((day) => day.date));
        setAvailability(data);
        setSelectedDate((prev) => {
          if (!prev) return null;
          const key = format(prev, 'yyyy-MM-dd');
          return availableKeys.has(key) ? prev : null;
        });
        setSelectedTime('');
      } catch (error) {
        console.error('Erro ao carregar disponibilidade', error);
        showError('Falha ao carregar horários disponíveis.');
        setHasError(true);
        setAvailability([]);
        setSelectedDate(null);
        setSelectedTime('');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAvailability();
  }, [selectedService.id, selectedProfessional?.id]);

  const hasAvailabilityForDate = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    return availabilityMap.has(key);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onDateTimeSelect(format(selectedDate, 'yyyy-MM-dd'), time);
    }
  };

  const isDateDisabled = (date: Date) => {
    if (date.getDay() === 0) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || !hasAvailabilityForDate(date);
  };

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, 'yyyy-MM-dd');
    return availabilityMap.get(key) ?? [];
  }, [availabilityMap, selectedDate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-bolt-neutral-500">Carregando disponibilidade...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center py-10 text-bolt-neutral-500">
        <p className="mb-2">Não foi possível carregar os horários disponíveis.</p>
        <p className="text-sm">Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (availability.length === 0) {
    return (
      <div className="text-center py-10 text-bolt-neutral-500">
        <p className="mb-2">Nenhum horário está disponível para este serviço nos próximos dias.</p>
        <p className="text-sm">Selecione outro profissional ou ajuste o período.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Escolha data e horário</h2>
        <div className="text-sm text-bolt-neutral-600">
          <p><span className="font-medium">{selectedService.name}</span> com <span className="font-medium">{selectedProfessional.name}</span></p>
          <p>Duração: {selectedService.duration} minutos</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <Calendar size={20} className="text-bolt-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-bolt-neutral-900">Selecione a data</h3>
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
                    ? 'bg-bolt-neutral-100 text-bolt-neutral-400 cursor-not-allowed'
                    : isSelected
                    ? 'bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 text-white shadow-lg'
                    : 'bg-bolt-neutral-50 text-bolt-neutral-700 hover:bg-bolt-primary-50 hover:text-bolt-primary-700'
                }`}
              >
                <div className="text-xs font-medium">
                  {format(date, 'EEE')}
                </div>
                <div className="text-lg font-bold">
                  {format(date, 'd')}
                </div>
                {isToday(date) && (
                  <div className="text-xs text-bolt-primary-600 font-medium">Hoje</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white rounded-2xl p-6 shadow-sm animate-slide-up">
          <div className="flex items-center mb-4">
            <Clock size={20} className="text-bolt-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-bolt-neutral-900">Selecione o horário</h3>
          </div>

          <div className="text-sm text-bolt-neutral-600 mb-4">
            {format(selectedDate, "EEEE, d 'de' MMMM")}
          </div>

          {slotsForSelectedDate.length === 0 ? (
            <div className="text-center text-sm text-bolt-neutral-500">
              Nenhum horário disponível neste dia.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {slotsForSelectedDate.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-xl text-center font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 text-white shadow-lg'
                      : 'bg-bolt-neutral-50 text-bolt-neutral-700 hover:bg-bolt-primary-50 hover:text-bolt-primary-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedDate && selectedTime && (
        <div className="bg-gradient-to-br from-bolt-primary-50 to-bolt-secondary-50 rounded-2xl p-6 animate-slide-up">
          <h3 className="font-semibold text-bolt-neutral-900 mb-3">Resumo do agendamento</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Serviço:</span>
              <span className="font-medium">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Profissional:</span>
              <span className="font-medium">{selectedProfessional.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Data:</span>
              <span className="font-medium">
                {format(selectedDate, "d 'de' MMMM")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Horário:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-bolt-neutral-600">Duração:</span>
              <span className="font-medium">{selectedService.duration} min</span>
            </div>
            <div className="flex justify-between border-t border-bolt-neutral-200 pt-2 mt-3">
              <span className="text-bolt-neutral-600">Valor:</span>
              <span className="font-bold text-lg text-bolt-primary-600">R$ {selectedService.price}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;