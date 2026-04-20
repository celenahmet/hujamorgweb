import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useActiveEvent } from './EventContext';
import { GameButton } from './ui/GameButton';
import { Users, Plus, MessageSquare, Terminal, Palette, Music, Megaphone, Trash2, Search, X, Loader2, Lock, ShieldPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LobbyAd {
  id: string;
  userName: string;
  role: string;
  intent: 'looking-for-team' | 'looking-for-member';
  description: string;
  contact: string;
  skills: string;
  submittedAt?: string;
  createdAt: any;
}

export const TeamLobby: React.FC = () => {
  const { activeEvent, loading } = useActiveEvent();
  const navigate = useNavigate();
  const [ads, setAds] = useState<LobbyAd[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAd, setNewAd] = useState({
    userName: '',
    role: 'Yazılımcı (Developer)',
    intent: 'looking-for-team' as LobbyAd['intent'],
    description: '',
    contact: '',
    skills: ''
  });

  useEffect(() => {
    if (!activeEvent || !activeEvent.id) return;

    const q = collection(db, `events/${activeEvent.id}/lobby`);
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LobbyAd));
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || new Date(a.submittedAt || 0).getTime() || 0;
        const timeB = b.createdAt?.toMillis?.() || new Date(b.submittedAt || 0).getTime() || 0;
        return timeB - timeA;
      });
      setAds(data);
    });
    return () => unsub();
  }, [activeEvent]);

  const handlePostAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent || !activeEvent.id) {
       alert("Hata: Etkinlik bilgisi alınamadı.");
       return;
    }
    setIsSubmitting(true);

    try {
      // Get IP and additional info for research data
      let ip = "Unknown";
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (ipErr) {
        console.warn("IP fetch failed", ipErr);
      }

      const metaData = {
        ipv4: ip,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
        submittedAt: new Date().toISOString()
      };

      await addDoc(collection(db, `events/${activeEvent.id}/lobby`), {
        ...newAd,
        ...metaData,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewAd({ userName: '', role: 'developer', intent: 'looking-for-team', description: '', contact: '', skills: '' });
    } catch (err: any) {
      console.error("Firestore Error:", err);
      alert(`Hata oluştu: ${err?.message || 'Veri iletilemedi.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('developer') || r.includes('yazılımcı')) return <Terminal size={14} />;
    if (r.includes('artist') || r.includes('sanatçı') || r.includes('animat')) return <Palette size={14} />;
    if (r.includes('sound') || r.includes('music') || r.includes('ses') || r.includes('müzik')) return <Music size={14} />;
    if (r.includes('designer') || r.includes('tasarım') || r.includes('story') || r.includes('hikaye')) return <Megaphone size={14} />;
    if (r.includes('manager') || r.includes('pm')) return <ShieldPlus size={14} />;
    return <Users size={14} />;
  };

  const filteredAds = ads.filter(ad => 
    ad.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return null;

  if (!activeEvent || !activeEvent.lobbyOpen) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 pt-32">
        <div className="max-w-md w-full bg-zinc-900/30 border border-cyber-red/20 p-12 text-center relative overflow-hidden rounded-lg">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyber-red/50" />
          <Lock className="w-16 h-16 text-cyber-red mx-auto mb-6" />
          <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">LOBİ ŞU AN KAPALI</h1>
          <p className="text-gray-400 mb-8 leading-relaxed font-sans text-sm">Takım lobisi bu etkinlik için şu an kapalıdır. Lütfen duyuruları takip ediniz.</p>
          <GameButton onClick={() => navigate('/')} variant="secondary">ANA SAYFAYA DÖN</GameButton>
        </div>
      </div>
    );
  }

  const inputCls = "w-full bg-black/60 border border-white/10 p-4 text-white text-sm focus:border-cyber-red outline-none transition-all placeholder:text-zinc-700 font-sans";
  const labelCls = "text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1 block";

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-cyber-red" />
            <span className="text-cyber-red font-mono text-xs font-black tracking-widest uppercase mb-2 block">// CONNECTING_PEOPLE</span>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">TAKIM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-red to-red-800">LOBİSİ</span></h1>
            <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-black">{activeEvent.title} İÇİN EKİP ARKADAŞI BUL</p>
          </div>
          <GameButton onClick={() => setIsModalOpen(true)} variant="primary" className="py-4 px-8 text-lg">İLAN YAYINLA <Plus className="ml-2" /></GameButton>
        </header>

        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text" 
              placeholder="ROl, YETENEK VEYA İSİM İLE ARA..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/40 border border-white/5 pl-12 pr-6 py-4 text-white focus:border-cyber-red outline-none transition-all uppercase font-black text-xs tracking-widest"
            />
          </div>
          <div className="px-6 py-4 bg-zinc-900/20 border border-white/5 flex items-center gap-3 w-full sm:w-auto">
            <Users className="text-cyber-red" size={20} />
            <div>
              <span className="block text-[10px] text-zinc-600 font-black leading-none uppercase">AKTİF İLAN</span>
              <span className="text-xl font-black text-white leading-none">{ads.length}</span>
            </div>
          </div>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <div key={ad.id} className="group bg-zinc-900/20 border border-white/5 hover:border-cyber-red/30 transition-all p-6 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                {getRoleIcon(ad.role)}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyber-red/10 border border-cyber-red/20 flex items-center justify-center rounded">
                   <Users size={20} className="text-cyber-red" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-tight text-lg">{ad.userName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black uppercase text-cyber-red tracking-widest bg-cyber-red/10 px-2 py-0.5 border border-cyber-red/20">{ad.role}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${ad.intent === 'looking-for-team' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
                      {ad.intent === 'looking-for-team' ? 'TAKIM ARIYOR' : 'ÜYE ARIYOR'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1">YETENEKLER_VE_ARAÇLAR</span>
                  <p className="text-zinc-400 text-xs font-sans tracking-wide leading-relaxed">{ad.skills}</p>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1">MESAJ</span>
                  <p className="text-zinc-300 text-sm font-sans tracking-wide leading-relaxed italic">"{ad.description}"</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
                   <Clock size={12} /> {ad.createdAt?.toDate ? ad.createdAt.toDate().toLocaleDateString('tr-TR') : 'YENİ'}
                </div>
                <a href={ad.contact.includes('@') ? `mailto:${ad.contact}` : `https://discord.com/users/${ad.contact}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] font-black text-white hover:text-cyber-red transition-colors uppercase tracking-widest">
                  İLETİŞİME GEÇ <MessageSquare size={14} className="text-cyber-red" />
                </a>
              </div>
            </div>
          ))}
          
          {filteredAds.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 bg-white/5 rounded-xl">
               <Users className="mx-auto text-zinc-800 mb-4" size={48} />
               <p className="text-zinc-600 font-black uppercase tracking-widest text-sm">HİÇ İLAN BULUNAMADI</p>
               <button onClick={() => setIsModalOpen(true)} className="text-cyber-red text-xs font-black uppercase tracking-widest mt-2 hover:underline">İLK SEN ÜRET</button>
            </div>
          )}
        </div>

        {/* POST AD MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-xl bg-zinc-950 border border-white/10 p-8 md:p-12 relative overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyber-red" />
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
              
              <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tighter flex items-center gap-3">LOBİYE <span className="text-cyber-red">KATIL</span></h2>
              <p className="text-[10px] text-zinc-600 font-black tracking-widest mb-8 uppercase">// NEW_SIGNAL_TRANSMISSION</p>
              
              <form onSubmit={handlePostAd} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                     <label className={labelCls}>İSİM VEYA NICKNAME</label>
                     <input type="text" required value={newAd.userName} onChange={e => setNewAd({...newAd, userName: e.target.value})} className={inputCls} placeholder="örn: CyberPunk_42" />
                   </div>
                   <div>
                     <label className={labelCls}>ROLÜN</label>
                      <select value={newAd.role} onChange={e => setNewAd({...newAd, role: e.target.value as any})} className={`${inputCls} appearance-none cursor-pointer`}>
                        <option value="Yazılımcı (Developer)" className="bg-zinc-900">Yazılımcı (Developer)</option>
                        <option value="2D Sanatçı (2D Artist)" className="bg-zinc-900">2D Sanatçı (2D Artist)</option>
                        <option value="3D Sanatçı (3D Artist)" className="bg-zinc-900">3D Sanatçı (3D Artist)</option>
                        <option value="Animatör (Animator)" className="bg-zinc-900">Animatör (Animator)</option>
                        <option value="Bölüm Tasarımcısı (Level Design)" className="bg-zinc-900">Bölüm Tasarımcısı (Level Design)</option>
                        <option value="Ses ve Müzik (SFX/Music)" className="bg-zinc-900">Ses ve Müzik (SFX/Music)</option>
                        <option value="Oyun Tasarımcısı (Game Design)" className="bg-zinc-900">Oyun Tasarımcısı (Game Design)</option>
                        <option value="Hikaye/Senaryo (Narrative)" className="bg-zinc-900">Hikaye/Senaryo (Narrative)</option>
                        <option value="Arayüz Tasarımı (UI/UX)" className="bg-zinc-900">Arayüz Tasarımı (UI/UX)</option>
                        <option value="Proje Yöneticisi (PM/Producer)" className="bg-zinc-900">Proje Yöneticisi (PM/Producer)</option>
                        <option value="Genelci (All-Rounder)" className="bg-zinc-900">Genelci (All-Rounder)</option>
                        <option value="Diğer (Other)" className="bg-zinc-900">Diğer (Other)</option>
                      </select>
                   </div>
                </div>

                <div>
                  <label className={labelCls}>AMACIN (İLAN TÜRÜ)</label>
                  <select value={newAd.intent} onChange={e => setNewAd({...newAd, intent: e.target.value as any})} className={`${inputCls} appearance-none cursor-pointer`}>
                     <option value="looking-for-team" className="bg-zinc-900">Takım Arıyorum (Bir ekibe dahil olmak istiyorum)</option>
                     <option value="looking-for-member" className="bg-zinc-900">Üye Arıyorum (Takımıma arkadaş arıyorum)</option>
                  </select>
                </div>
                
                <div>
                  <label className={labelCls}>YETENEKLER & ARAÇLAR</label>
                  <input type="text" required value={newAd.skills} onChange={e => setNewAd({...newAd, skills: e.target.value})} className={inputCls} placeholder="örn: Unity, C#, Pixel Art, Blender..." />
                </div>

                <div>
                  <label className={labelCls}>İLETİŞİM (Discord ID veya E-posta)</label>
                  <input type="text" required value={newAd.contact} onChange={e => setNewAd({...newAd, contact: e.target.value})} className={inputCls} placeholder="örn: can_yildiz#1234" />
                </div>

                <div>
                  <label className={labelCls}>KISA MESAJ (Aradığın kişi veya amacın)</label>
                  <textarea required value={newAd.description} onChange={e => setNewAd({...newAd, description: e.target.value})} rows={3} className={`${inputCls} resize-none`} placeholder="örn: Roguelike bir oyun fikrim var, bir artist arıyorum..." />
                </div>

                <div className="pt-4">
                  <GameButton type="submit" variant="primary" className="w-full justify-center py-5 text-xl" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'SİNYALİ GÖNDER'}
                  </GameButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Clock = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
