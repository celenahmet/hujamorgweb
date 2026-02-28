import React from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { MapPin, Wifi, Navigation, Zap } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

export const Location: React.FC = () => {
  const { language } = useLanguage();
  const t = UI_TEXT[language].location;

  return (
    <SectionFrame id="location" title={t.title}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-cyber-red/30 bg-zinc-900/80 backdrop-blur-sm relative overflow-hidden">
            {/* Top Decoration */}
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
                        <p className="text-gray-400 font-mono text-sm">Tunçalp Özgen K.K.M.</p>
                    </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-8">
                    {t.venue_desc_prefix} 
                    <span className="text-white font-bold"> {t.venue_name}</span>{t.venue_desc_suffix}
                </p>

                <div className="flex gap-4">
                    <div className="flex-1 bg-black/40 p-3 border border-white/10">
                        <span className="block text-xs text-gray-500 font-mono mb-1">LATITUDE</span>
                        <span className="text-cyber-red font-mono">39.8724° N</span>
                    </div>
                    <div className="flex-1 bg-black/40 p-3 border border-white/10">
                        <span className="block text-xs text-gray-500 font-mono mb-1">LONGITUDE</span>
                        <span className="text-cyber-red font-mono">32.7317° E</span>
                    </div>
                </div>
            </div>

            {/* Right Panel: Network & Status */}
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

                    <div className="flex items-center gap-4 p-4 border border-yellow-500/30 bg-yellow-900/10">
                        <Zap className="text-yellow-500" />
                        <div>
                             <h4 className="text-yellow-400 font-bold font-mono tracking-widest text-sm">{t.sleep_mode}</h4>
                             <p className="text-gray-400 text-xs">{t.sleep_desc}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-dashed border-white/10 text-center">
                    <a 
                        href="https://maps.google.com/?q=Tunçalp+Özgen+Kongre+ve+Kültür+Merkezi" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-cyber-red transition-colors group"
                    >
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