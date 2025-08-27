import React from 'react';
import MainHeader from '../../components/Layout/MainHeader';
import MainFooter from '../../components/Layout/MainFooter';
import DebugComponent from '../../components/UI/DebugComponent';

export default function Home() {

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <MainHeader />
      
      {/* Debug Component - Temporário */}
      <DebugComponent />
      
      {/* Footer */}
      <MainFooter />
    </div>
  );
}
