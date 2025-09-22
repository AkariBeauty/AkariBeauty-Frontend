// src/pages/Client/Booking/BookingWizard.tsx
import React, { useState } from 'react';
import { ArrowLeft, Check } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Service, Professional, BookingData } from '../../../types'; // Verifique o caminho aqui
import ServiceSelection from './steps/ServiceSelection';
import ProfessionalSelection from './steps/ProfessionalSelection';
import DateTimeSelection from './steps/DateTimeSelection';
import BookingConfirmation from './steps/BookingConfirmation';
import { clienteService } from '../../../services/clienteService';

const BookingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Serviço', completed: !!bookingData.service },
    { number: 2, title: 'Profissional', completed: !!bookingData.professional },
    { number: 3, title: 'Data e Hora', completed: !!bookingData.date && !!bookingData.time },
    { number: 4, title: 'Confirmação', completed: false },
  ];

  const handleServiceSelect = (service: Service) => {
    setBookingData(prev => ({ ...prev, service }));
    setCurrentStep(2);
  };

  const handleProfessionalSelect = (professional: Professional) => {
    setBookingData(prev => ({ ...prev, professional }));
    setCurrentStep(3);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, date, time }));
    setCurrentStep(4);
  };

  const handleBookingConfirm = async () => {
    try {
      // Criar o agendamento na API
      await clienteService.createAppointment({
        serviceId: bookingData.service!.id,
        professionalId: bookingData.professional!.id,
        date: bookingData.date!,
        time: bookingData.time!,
        notes: bookingData.notes
      });
      
      console.log('Agendamento confirmado:', bookingData);
      navigate('/appointments');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      // Aqui você pode adicionar um toast ou modal de erro
      alert('Erro ao criar agendamento. Tente novamente.');
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection onServiceSelect={handleServiceSelect} />;
      case 2:
        return <ProfessionalSelection
          selectedService={bookingData.service!}
          onProfessionalSelect={handleProfessionalSelect}
        />;
      case 3:
        return <DateTimeSelection
          selectedService={bookingData.service!}
          selectedProfessional={bookingData.professional!}
          onDateTimeSelect={handleDateTimeSelect}
        />;
      case 4:
        return <BookingConfirmation
          bookingData={bookingData}
          onConfirm={handleBookingConfirm}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bolt-primary-50 to-bolt-secondary-50"> {/* RENOMEADO AQUI */}
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-bolt-primary-100 px-4 py-4 sticky top-0 z-40"> {/* RENOMEADO AQUI */}
        <div className="flex items-center max-w-7xl mx-auto">
          <button
            onClick={goBack}
            className="p-2 rounded-xl hover:bg-bolt-primary-50 transition-colors mr-4" // RENOMEADO AQUI
          >
            <ArrowLeft size={20} className="text-bolt-neutral-600" /> {/* RENOMEADO AQUI */}
          </button>
          <h1 className="text-xl font-semibold text-bolt-neutral-900">Novo Agendamento</h1> {/* RENOMEADO AQUI */}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`wizard-step flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step.completed
                      ? 'bg-green-500 text-white' // Esta cor 'green' deve ser a do Bolt.new, já definida
                      : currentStep === step.number
                      ? 'bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 text-white' // RENOMEADO AQUI
                      : 'bg-bolt-neutral-200 text-bolt-neutral-600' // RENOMEADO AQUI
                  }`}>
                    {step.completed ? <Check size={16} /> : step.number}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep === step.number ? 'text-bolt-neutral-900' : 'text-bolt-neutral-600' // RENOMEADO AQUI
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step.completed ? 'bg-green-500' : 'bg-bolt-neutral-200' // 'green' aqui deve ser a do Bolt.new
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;