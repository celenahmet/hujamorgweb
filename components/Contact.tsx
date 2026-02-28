import React, { useState, useEffect } from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { GameButton } from './ui/GameButton';
import { Send, Terminal, MessageSquare, Mail, ExternalLink, Radio, Globe, Code, Activity, Trophy } from 'lucide-react';
import { useSound } from './SoundManager';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

export const Contact: React.FC = () => {
  const { playClick, playHover } = useSound();
  const { language } = useLanguage();
  const t = UI_TEXT[language].contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Uptime Counter - Now counts current session time starting from 0
  const [uptime, setUptime] = useState(0); 
  const [graphBars, setGraphBars] = useState<number[]>([]);

  useEffect(() => {
    // Initial bars
    setGraphBars(Array.from({ length: 20 }, () => Math.random() * 100));

    const interval = setInterval(() => {
        setUptime(prev => prev + 1);
        // Regenerate graph bars every second to create activity effect
        setGraphBars(Array.from({ length: 20 }, () => Math.random() * 60 + 40)); 
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    // Correct data: only show hours/min/sec of current session
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    // Simulating form submission
    alert(t.alert_sent);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  // Switched to font-sans for better Turkish character support in inputs
  const inputClasses = `
    w-full bg-zinc-900/50 border border-white/10 text-white p-4 
    focus:border-cyber-red focus:ring-1 focus:ring-cyber-red focus:outline-none 
    transition-all duration-300 font-sans placeholder-gray-600
    group-hover:bg-zinc-900/80
  `;

  // Switched to font-sans for better Turkish character support in labels
  const labelClasses = "block text-cyber-red font-sans text-xs mb-2 tracking-widest uppercase font-bold";

  return (
    <SectionFrame id="contact" title={t.title}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-zinc-900/30 p-1 border border-white/5 relative">
            
            {/* Form Side */}
            <div className="md:col-span-3 p-6 md:p-8 relative bg-zinc-950/50 border border-white/10">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Terminal size={40} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-cyber-red block" />
                    {t.send_msg_title}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="group">
                        <label htmlFor="name" className={labelClasses}>{t.name}</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            required
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={playHover}
                            placeholder={t.name_ph}
                            className={inputClasses}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="group">
                            <label htmlFor="email" className={labelClasses}>{t.email}</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={playHover}
                                placeholder={t.email_ph}
                                className={inputClasses}
                            />
                        </div>
                        <div className="group">
                            <label htmlFor="phone" className={labelClasses}>{t.phone}</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                onFocus={playHover}
                                placeholder={t.phone_ph}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label htmlFor="message" className={labelClasses}>{t.message}</label>
                        <textarea 
                            id="message" 
                            name="message" 
                            rows={5}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={playHover}
                            placeholder={t.message_ph}
                            className={`${inputClasses} resize-none`}
                        />
                    </div>

                    <div className="pt-2">
                        <GameButton type="submit" variant="primary" className="w-full justify-center">
                            {t.submit} <Send size={18} className="ml-2" />
                        </GameButton>
                    </div>
                </form>
            </div>

            {/* Info Side (Channels & Events) */}
            <div className="md:col-span-2 flex flex-col bg-zinc-900/50 border border-white/10 relative overflow-hidden group">
                
                <div className="p-6 pb-0 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                        <h4 className="text-white font-bold tracking-widest uppercase text-xs sm:text-sm flex items-center gap-2">
                            <Radio size={16} className="text-cyber-red animate-pulse" />
                            {t.channels_title}
                        </h4>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-cyber-red rounded-full" />
                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                        </div>
                    </div>
                    
                    <div className="space-y-3 relative z-10">
                        
                        {/* Discord Card */}
                        <a 
                            href="https://discord.gg/acmhacettepe" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-3 bg-black/40 border border-white/5 hover:border-[#5865F2] hover:bg-[#5865F2]/5 transition-all group/card relative overflow-hidden"
                            onMouseEnter={playHover}
                        >
                            <div className="absolute top-2 right-2 opacity-50 group-hover/card:opacity-100 transition-opacity">
                                <ExternalLink size={12} className="text-gray-500 group-hover/card:text-[#5865F2]" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-[#5865F2]/10 rounded text-[#5865F2]">
                                    <MessageSquare size={16} />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold text-xs mb-0.5 group-hover/card:text-[#5865F2] transition-colors">{t.discord_title}</h5>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        {t.discord_desc}
                                    </p>
                                </div>
                            </div>
                        </a>

                        {/* Mail Card */}
                        <a 
                            href="mailto:iletisim@acmhacettepe.com"
                            className="block p-3 bg-black/40 border border-white/5 hover:border-cyber-red hover:bg-cyber-red/5 transition-all group/card relative overflow-hidden"
                            onMouseEnter={playHover}
                        >
                            <div className="absolute top-2 right-2 opacity-50 group-hover/card:opacity-100 transition-opacity">
                                <ExternalLink size={12} className="text-gray-500 group-hover/card:text-cyber-red" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-cyber-red/10 rounded text-cyber-red">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold text-xs mb-0.5 group-hover/card:text-cyber-red transition-colors">{t.mail_title}</h5>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        iletisim@acmhacettepe.com
                                    </p>
                                </div>
                            </div>
                        </a>

                        {/* Divider & Event Header */}
                        <div className="pt-4 pb-2">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-3 bg-white/20" />
                                {/* Switched to font-sans for better Turkish character support */}
                                <h5 className="text-[10px] font-sans font-bold text-gray-500 tracking-[0.2em] uppercase">
                                    {t.ecosystem_title}
                                </h5>
                                <div className="h-[1px] bg-white/10 flex-1" />
                            </div>

                            {/* HUPROG Card */}
                            <a 
                                href="https://huprog.acmhacettepe.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block p-3 mb-3 bg-black/40 border border-white/5 hover:border-cyan-500 hover:bg-cyan-500/5 transition-all group/card relative overflow-hidden"
                                onMouseEnter={playHover}
                            >
                                <div className="absolute top-2 right-2 opacity-50 group-hover/card:opacity-100 transition-opacity">
                                    <ExternalLink size={12} className="text-gray-500 group-hover/card:text-cyan-500" />
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-500">
                                        <Code size={16} />
                                    </div>
                                    <div>
                                        <h5 className="text-white font-bold text-xs mb-0.5 group-hover/card:text-cyan-500 transition-colors">{t.huprog_title}</h5>
                                        <p className="text-[10px] text-gray-400 leading-tight">
                                            {t.huprog_desc}
                                        </p>
                                        <span className="text-[9px] font-mono text-cyan-500/70 block mt-1">huprog.acmhacettepe.com</span>
                                    </div>
                                </div>
                            </a>

                            {/* ACSDAYS Card */}
                            <div className="block p-3 bg-black/40 border border-white/5 hover:border-purple-500 hover:bg-purple-500/5 transition-all group/card relative overflow-hidden pt-8">
                                
                                {/* Highlight Banner (Top) */}
                                <div className="absolute top-0 right-0 left-0 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center justify-center py-1 gap-1.5">
                                    <Trophy size={9} className="text-yellow-400" />
                                    <span className="text-[8px] font-bold text-yellow-400 tracking-widest uppercase">
                                        {t.acsdays_highlight}
                                    </span>
                                </div>

                                {/* Main Link Area */}
                                <a 
                                    href="https://acsdays.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block relative z-10 mb-3"
                                    onMouseEnter={playHover}
                                >
                                    <div className="absolute top-0 right-0 opacity-50 group-hover/card:opacity-100 transition-opacity">
                                        <ExternalLink size={12} className="text-gray-500 group-hover/card:text-purple-500" />
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-purple-500/10 rounded text-purple-500">
                                            <Globe size={16} />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold text-xs mb-0.5 group-hover/card:text-purple-500 transition-colors">{t.acsdays_title}</h5>
                                            <p className="text-[10px] text-gray-400 leading-tight">
                                                {t.acsdays_desc}
                                            </p>
                                            
                                            {/* Website Text Link - Like HUPROG */}
                                            <span className="text-[9px] font-mono text-purple-500/70 block mt-1">acsdays.com</span>
                                        </div>
                                    </div>
                                </a>

                                {/* Mobile App Buttons - Custom SVG Badges */}
                                <div className="flex gap-2 relative z-20">
                                    {/* App Store Badge */}
                                    <a 
                                        href="https://acsdays.com/appstore" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-1.5 px-2 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 rounded transition-all group/store"
                                        onMouseEnter={playHover}
                                    >
                                        <svg viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4 text-gray-300 group-hover/store:text-white transition-colors">
                                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
                                        </svg>
                                        <div className="flex flex-col items-start leading-none">
                                            {/* Manually uppercased English text to avoid Locale 'i' -> 'İ' issues */}
                                            <span className="text-[7px] text-gray-500 font-sans tracking-wider">DOWNLOAD ON</span>
                                            <span className="text-[9px] font-bold text-gray-300 group-hover/store:text-white transition-colors">App Store</span>
                                        </div>
                                    </a>

                                    {/* Google Play Badge */}
                                    <a 
                                        href="https://acsdays.com/googleplay" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-1.5 px-2 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 rounded transition-all group/store"
                                        onMouseEnter={playHover}
                                    >
                                        <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4 text-gray-300 group-hover/store:text-white transition-colors">
                                            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                                        </svg>
                                        <div className="flex flex-col items-start leading-none">
                                            {/* Manually uppercased English text to avoid Locale 'i' -> 'İ' issues */}
                                            <span className="text-[7px] text-gray-500 font-sans tracking-wider">GET IT ON</span>
                                            <span className="text-[9px] font-bold text-gray-300 group-hover/store:text-white transition-colors">Google Play</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>

                {/* Uptime Footer Effect - With Green Blocks Graph */}
                <div className="mt-4 p-4 border-t border-white/5 bg-black/40 font-mono text-[10px] relative">
                    <div className="flex justify-between items-end relative z-10">
                        {/* Left: Text & Counter */}
                        <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2 text-gray-500">
                                <Activity size={12} className="text-green-500 animate-pulse" />
                                <span className="tracking-wider">{t.uptime_label}</span>
                            </div>
                            <span className="text-green-500 font-bold tracking-widest tabular-nums text-xs">
                                {formatUptime(uptime)}
                            </span>
                        </div>

                        {/* Right: Green Blocks Graph Visualizer */}
                        <div className="flex items-end gap-0.5 h-8 opacity-80 pb-1">
                            {graphBars.map((height, i) => (
                                <div 
                                    key={i}
                                    className="w-1.5 bg-green-500 transition-all duration-1000 ease-in-out"
                                    style={{ 
                                        height: `${height}%`,
                                        opacity: i === graphBars.length - 1 ? 1 : 0.3 + (height / 200) // Newer bars brighter
                                    }} 
                                >
                                    {/* Scanline effect inside bar */}
                                    <div className="w-full h-full bg-black/20" style={{ backgroundSize: '100% 2px' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Background Noise for Footer */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwZjAiLz4KPC9zdmc+')] opacity-10" />
                </div>

                {/* Background Grid Animation */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            </div>

        </div>
      </div>
    </SectionFrame>
  );
};