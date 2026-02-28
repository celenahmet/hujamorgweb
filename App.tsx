import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Location } from './components/Location';
import { Themes } from './components/Themes';
import { Sponsors } from './components/Sponsors';
// import { Portfolios } from './components/Portfolios';
import { Gallery } from './components/Gallery';
import { About } from './components/About';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SoundProvider } from './components/SoundManager';
import { LanguageProvider } from './components/LanguageContext';
import { Cursor } from './components/ui/Cursor';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <SoundProvider>
        <div className="min-h-screen bg-cyber-black text-gray-200 selection:bg-cyber-red selection:text-white font-sans cursor-none">
          
          <Cursor />

          {/* Global Scanline Overlay */}
          <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,6px_100%] opacity-20" />
          
          <Navbar />
          
          <main>
            <Hero />
            <div className="space-y-0">
              <Location />
              <Themes />
              <Sponsors />
              <Gallery />
              {/* <Portfolios /> */}
              <About />
              <FAQ />
              <Contact />
            </div>
          </main>
          
          <Footer />
        </div>
      </SoundProvider>
    </LanguageProvider>
  );
};

export default App;