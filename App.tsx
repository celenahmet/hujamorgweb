import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Location } from './components/Location';
import { Themes } from './components/Themes';
import { Sponsors } from './components/Sponsors';
import { Gallery } from './components/Gallery';
import { About } from './components/About';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SoundProvider } from './components/SoundManager';
import { LanguageProvider } from './components/LanguageContext';
import { Cursor } from './components/ui/Cursor';
import { Admin } from './components/Admin';
import { ApplyForm } from './components/ApplyForm';
import { EventProvider } from './components/EventContext';
import { TeamLobby } from './components/TeamLobby';
import { LobbySection } from './components/LobbySection';
import { Organizers } from './components/Organizers';
import { Winners } from './components/Winners';

const LandingPage: React.FC = () => (
  <main>
    <Hero />
    <LobbySection />
    <div className="space-y-0">
      <Location />
      <Themes />
      <Sponsors />
      <Gallery />
      <Organizers />
      <Winners />
      <FAQ />
      <Contact />
    </div>
  </main>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const isApplyPage = location.pathname === '/apply';
  const isLobbyPage = location.pathname === '/lobby';

  return (
    <div className={`min-h-screen bg-cyber-black text-gray-200 selection:bg-cyber-red selection:text-white font-sans ${isAdminPage || isApplyPage ? '' : 'cursor-none'}`}>
      {!isAdminPage && !isApplyPage && <Cursor />}

      {/* Global Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,6px_100%] opacity-20" />
      
      {!isAdminPage && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/apply" element={<ApplyForm />} />
        <Route path="/lobby" element={<TeamLobby />} />
      </Routes>
      
      {!isAdminPage && !isApplyPage && !isLobbyPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <SoundProvider>
        <EventProvider>
          <Router>
            <AppContent />
          </Router>
        </EventProvider>
      </SoundProvider>
    </LanguageProvider>
  );
};

export default App;