import React from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { MapPin, Wifi, Navigation, Zap, Clock } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';
import { useActiveEvent } from './EventContext';

export const Location: React.FC = () => {
  const { language } = useLanguage();
  const t = UI_TEXT[language].location;
  const { activeEvent, currentEventId } = useActiveEvent();

  // Dynamic values from Firestore, fallback to hardcoded
  const venueName = activeEvent?.eventLocation || 'Tunçalp Özgen K.K.M.';
  const mapUrl = activeEvent?.eventLocationUrl || 'https://maps.google.com/?q=Tunçalp+Özgen+Kongre+ve+Kültür+Merkezi';
  const eventDate = activeEvent?.eventDate || '';
  const isActive = activeEvent?.isActive || false;
  const isMainEvent = activeEvent?.title === "HUJAM'25" || (!activeEvent && !currentEventId);

  // Default coords for Hujam'25 if not provided
  const lat = activeEvent?.latitude || (isMainEvent ? '39.8724° N' : '');
  const lng = activeEvent?.longitude || (isMainEvent ? '32.7317° E' : '');

  return (
    <SectionFrame id="location" title={t.title}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-cyber-red/30 bg-zinc-900/80 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-red via-transparent to-cyber-red opacity-50" />
            
            {/* Left Panel: Venue Info */}
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-cyber-red/20 relative group">
                <div className="absolute top-4 left-4 text-cyber-red/40 font-mono text-xs">Target_Loc.v2</div>
                
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-cyber-red/10 border border-cyber-red rounded-sm">
                        <MapPin className="text-cyber-red w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">{t.venue_label}</h3>
                        <p className="text-gray-400 font-mono text-sm">{venueName}</p>
                    </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-8">
                    {t.venue_desc_prefix} 
                    <span className="text-white font-bold"> {venueName}</span> {t.venue_desc_suffix || ''}
                </p>

                {(lat || lng) && (
                  <div className="flex gap-4">
                      {lat && (
                        <div className="flex-1 bg-black/40 p-3 border border-white/10">
                            <span className="block text-[10px] text-gray-500 font-mono mb-1 tracking-widest">LATITUDE</span>
                            <span className="text-cyber-red font-mono text-sm">{lat}</span>
                        </div>
                      )}
                      {lng && (
                        <div className="flex-1 bg-black/40 p-3 border border-white/10">
                            <span className="block text-[10px] text-gray-500 font-mono mb-1 tracking-widest">LONGITUDE</span>
                            <span className="text-cyber-red font-mono text-sm">{lng}</span>
                        </div>
                      )}
                  </div>
                )}
            </div>

            {/* Right Panel */}
            <div className="p-8 md:p-12 relative flex flex-col justify-between bg-cyber-black/50">
                <div className="absolute top-4 right-4 text-cyber-red/40 font-mono text-xs">Net_Stat.online</div>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 border border-green-500/30 bg-green-900/10">
                        <Wifi className="text-green-500 animate-pulse" />
                        <div>
                            <h4 className="text-green-400 font-bold font-mono tracking-widest text-sm">{t.network_status}</h4>
                            <p className="text-gray-400 text-xs">{t.network_desc}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 border border-cyber-red/30 bg-cyber-red/10">
                        <Clock className="text-cyber-red animate-pulse" />
                        <div>
                             <h4 className="text-white font-bold font-mono tracking-widest text-sm uppercase">{language === 'tr' ? 'ETKİNLİK ZAMANI' : 'EVENT SCHEDULE'}</h4>
                             <p className="text-gray-400 text-xs">{eventDate || (language === 'tr' ? 'HENÜZ DUYURULMADI' : 'NOT ANNOUNCED YET')}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-dashed border-white/10 text-center">
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-cyber-red transition-colors group">
                        <Navigation size={16} className="group-hover:rotate-45 transition-transform" /> 
                        {t.show_map}
                    </a>
                </div>
            </div>
        </div>
      </div>
    </SectionFrame>
  );
};