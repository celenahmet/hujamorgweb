import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useActiveEvent } from './EventContext';
import { GameButton } from './ui/GameButton';
import { Users, Plus, MessageSquare, Search, X, Loader2, ArrowRight, UserPlus, Users2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LobbySection: React.FC = () => {
  const { activeEvent, loading } = useActiveEvent();
  const navigate = useNavigate();
  const [ads, setAds] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'post' | 'select' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newAd, setNewAd] = useState({
    userName: '',
    role: 'developer',
    intent: 'looking-for-team' as 'looking-for-team' | 'looking-for-member',
    description: '',
    contact: '',
    skills: ''
  });

  useEffect(() => {
    if (!activeEvent?.id) return;
    const q = collection(db, `events/${activeEvent.id}/lobby`);
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis?.() || new Date(a.submittedAt || 0).getTime() || 0;
        const timeB = b.createdAt?.toMillis?.() || new Date(b.submittedAt || 0).getTime() || 0;
        return timeB - timeA;
      });
      setAds(data.slice(0, 3));
    });
    return () => unsub();
  }, [activeEvent]);

  if (loading) return null;
  
  if (!activeEvent || !activeEvent.lobbyOpen) return null;

  const handlePostAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let ip = "Unknown";
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (ipErr) {
        console.warn("IP fetch failed", ipErr);
      }

      await addDoc(collection(db, `events/${activeEvent.id}/lobby`), {
        ...newAd,
        ipv4: ip,
        userAgent: navigator.userAgent,
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setModalMode('view');
    } catch (err) {
      alert("Hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full bg-black/60 border border-white/10 p-4 text-white text-sm focus:border-cyber-red outline-none transition-all placeholder:text-zinc-700";
  const labelCls = "text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1 block";

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden border-y border-white/5">
      {/* Visual background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-24 h-24 border-l-2 border-t-2 border-cyber-red/30" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-r-2 border-b-2 border-cyber-red/30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-cyber-red font-mono text-xs font-black tracking-widest uppercase mb-2 block animate-pulse">// ACCESSING_LOBBY_STREAM</span>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-6">
              TAKIMINI <span className="text-cyber-red italic">KUR</span> & <span className="italic">Geliştir</span>
            </h2>
            <p className="text-zinc-500 text-lg font-sans leading-relaxed">
              Yalnız gitmek tehlikeli! Hujam'da en iyi oyunlar güçlü ekiplerden doğar. 
              Geliştirici, sanatçı veya müzisyen mi arıyorsun? Şimdi lobimize katıl.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <GameButton onClick={() => { setModalMode('select'); setIsModalOpen(true); }} variant="primary" className="flex-1 md:flex-none justify-center py-4 px-8">LOBİYE GİRİŞ YAP</GameButton>
             <GameButton onClick={() => navigate('/lobby')} variant="secondary" className="flex-1 md:flex-none justify-center py-4 px-8 border-white/10">TÜM İLANLAR</GameButton>
          </div>
        </div>

        {/* Quick Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {ads.map((ad, i) => (
             <div key={ad.id} className="bg-zinc-900/20 border border-white/5 p-6 hover:border-cyber-red/30 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-cyber-red/10 border border-cyber-red/20 flex items-center justify-center font-black text-cyber-red text-xs">{ad.userName[0]}</div>
                  <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-tight">{ad.userName}</h4>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">{ad.role}</span>
                  </div>
                </div>
                <p className="text-zinc-400 text-xs italic mb-4 line-clamp-2">"{ad.description}"</p>
                <div className="flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity">
                   <span className="text-[9px] text-zinc-600 font-mono">#{i + 1}_LOG</span>
                   <button onClick={() => navigate('/lobby')} className="text-cyber-red font-black text-[9px] uppercase tracking-widest flex items-center gap-1">PROFİLİ GÖR <ArrowRight size={10} /></button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* LOBBY INTERACTIVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 p-8 md:p-12 relative overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyber-red" />
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-600 hover:text-white"><X size={24} /></button>

              {modalMode === 'select' && (
                <div className="text-center py-10 animate-in zoom-in-95 duration-300">
                   <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">NE YAPMAK İSTERSİN?</h2>
                   <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-10">// SELECT_CHOICE_FROM_LIST</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button onClick={() => setModalMode('post')} className="p-8 bg-zinc-900/40 border border-white/5 hover:border-cyber-red transition-all group flex flex-col items-center">
                         <UserPlus size={48} className="text-cyber-red mb-4 group-hover:scale-110 transition-transform" />
                         <span className="text-white font-black uppercase tracking-widest text-sm">İLAN YAYINLA</span>
                         <span className="text-[9px] text-zinc-600 mt-2">EKİP ARKADAŞI ARIYORUM</span>
                      </button>
                      <button onClick={() => navigate('/lobby')} className="p-8 bg-zinc-900/40 border border-white/5 hover:border-white/30 transition-all group flex flex-col items-center">
                         <Users2 size={48} className="text-zinc-500 mb-4 group-hover:scale-110 transition-transform" />
                         <span className="text-white font-black uppercase tracking-widest text-sm">LOBİYİ GÖR</span>
                         <span className="text-[9px] text-zinc-600 mt-2">BAŞKALARINA KATILMAK İSTİYORUM</span>
                      </button>
                   </div>
                </div>
              )}

              {modalMode === 'post' && (
                <div className="animate-in slide-in-from-right-4 duration-500">
                   <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">İLANINI <span className="text-cyber-red">YAYINLA</span></h2>
                   <p className="text-[10px] text-zinc-600 font-black tracking-widest mb-8 uppercase">// POSTING_TO_ACTIVE_STREAM</p>
                   
                   <form onSubmit={handlePostAd} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelCls}>İSİM / NICKNAME</label><input type="text" required value={newAd.userName} onChange={e => setNewAd({...newAd, userName: e.target.value})} className={inputCls} /></div>
                        <div>
                          <label className={labelCls}>ROLÜN</label>
                          <select value={newAd.role} onChange={e => setNewAd({...newAd, role: e.target.value})} className={inputCls}>
                             <option value="developer">Yazılımcı (Dev)</option>
                             <option value="artist">Sanatçı (Art)</option>
                             <option value="sound">Müzik/Ses (SFX)</option>
                             <option value="designer">Tasarımcı (GD)</option>
                          </select>
                        </div>
                      </div>
                      <div><label className={labelCls}>YETENEKLER</label><input type="text" required value={newAd.skills} onChange={e => setNewAd({...newAd, skills: e.target.value})} className={inputCls} placeholder="Unity, C#, Pixel Art..." /></div>
                      <div><label className={labelCls}>İLETİŞİM (Discord/Mail)</label><input type="text" required value={newAd.contact} onChange={e => setNewAd({...newAd, contact: e.target.value})} className={inputCls} /></div>
                      <div><label className={labelCls}>KISA MESAJ</label><textarea required value={newAd.description} onChange={e => setNewAd({...newAd, description: e.target.value})} className={`${inputCls} resize-none`} rows={3} /></div>
                      
                      <div className="pt-4 flex gap-4">
                         <button type="button" onClick={() => setModalMode('select')} className="text-xs font-black text-zinc-500 uppercase tracking-widest">GERİ</button>
                         <GameButton type="submit" variant="primary" className="flex-1 justify-center py-4" disabled={isSubmitting}>
                           {isSubmitting ? <Loader2 className="animate-spin" /> : 'İLAN YAYINLA'}
                         </GameButton>
                      </div>
                   </form>
                </div>
              )}

              {modalMode === 'view' && (
                <div className="text-center py-10 animate-in zoom-in-95 duration-300">
                   <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Plus className="text-green-500 animate-bounce" />
                   </div>
                   <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">İLAN YAYINLANDI!</h2>
                   <p className="text-zinc-500 text-xs font-sans mb-8">İlanın başarıyla lobiye eklendi. Diğer ilanlara göz atmak ister misin?</p>
                   <div className="flex flex-col gap-3">
                      <GameButton onClick={() => navigate('/lobby')} variant="primary" className="w-full justify-center">LOBİYİ GÖR</GameButton>
                      <button onClick={() => setIsModalOpen(false)} className="text-xs font-black text-zinc-700 uppercase tracking-widest hover:text-white transition-colors">ANA SAYFAYA DÖN</button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </section>
  );
};
