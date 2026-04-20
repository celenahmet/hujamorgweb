import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AlertModal } from './ui/AlertModal';
import { useActiveEvent } from './EventContext';
import { GameButton } from './ui/GameButton';
import { 
  Users, User, Mail, Phone, GraduationCap, Send, ChevronRight, 
  ChevronLeft, Terminal, ShieldPlus, History, Info, Server, Cpu, HardDrive, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import universitiesData from '../data/universities.json';

interface University {
  UniversityUid: number;
  UniversityName: string;
  University_logourl: string;
}

const universities = universitiesData as University[];

export const ApplyForm: React.FC = () => {
  const { language } = useLanguage();
  const { activeEvent, loading } = useActiveEvent();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

  const t = {
    tr: {
      registryTitle: "SYSTEM_REGISTRY_V2.0",
      apply: "BAŞVURU_FORMU",
      progress: "AKTARIM_SÜRECİ",
      captainOnly: "Başvuruları yalnızca takım kaptanları takımları adına yapmalıdır. Organizasyon, süreç boyunca takım kaptanıyla iletişimde olacaktır.",
      step1: "TAKIM BİLGİSİ",
      step2: "EKİP ÜYELERİ",
      step3: "DENEYİM",
      step4: "SUNUCU TALEBİ",
      step5: "SAĞLIK & ONAY",
      teamName: "TAKIM İSMİ *",
      teamSize: "TOPLAM ÜYE SAYISI (KAPTAN DAHİL) *",
      captainInfo: "TAKIM KAPTANI (PERSON 01)",
      nameLabel: "AD SOYAD *",
      emailLabel: "E-POSTA ADRESİ *",
      phoneLabel: "TELEFON NUMARASI *",
      uniLabel: "ÜNİVERSİTE *",
      deptLabel: "BÖLÜM *",
      gradeLabel: "SINIF *",
      memberInfo: "ÜYE",
      prevPart: "HUJAM'A DAHA ÖNCE KATILDINIZ MI? *",
      prevPartNo: "Hayır, takımdaki herkes ilk kez katılıyor.",
      prevPartYesHujam: "Evet, daha önce HUJAM'a katılmış üyeler var.",
      prevPartYesOther: "Evet, başka Game Jam'lere katılmış üyeler var.",
      expLabel: "DAHA ÖNCE BENZER YARIŞMA GEÇMİŞİNİZ / PORTFOLYONUZ",
      expPlaceholder: "Kısaca tecrübelerinizden bahsedin veya varsa proje linklerini paylaşın...",
      serverReq: "SUNUCU TALEBİNİZ VAR MI? *",
      serverNo: "Hayır, ihtiyacımız yok.",
      serverYes: "Evet, sunucu talep ediyoruz.",
      serverDetails: "TALEP DETAYLARI (OS, vCPU, RAM, DISK) *",
      healthLabel: "TAKIMDA ÖZEL RAHATSIZLIĞI VEYA İLAÇ KULLANAN ÜYE VARSA BELİRTİNİZ",
      healthPlaceholder: "Alerji, düzenli ilaç kullanımı vb...",
      healthWarning: "ÖNEMLİ: Organizasyon ekibine bildirilmeyen özel durum, kronik rahatsızlık veya alerjilerin etkinlik sırasında oluşturabileceği herhangi bir problemden HUJAM ekibi ve organizasyon sorumlu tutulamaz. Organizasyon taraflı alınabilecek ve acil durumlarda yapılacak önerilerin takibi ve acil durumlarda iletişim kurulacak bir yakınınızın numarasının paylaşılması zorunludur.",
      emergencyContact: "ACİL DURUM İLETİŞİM NUMARASI (YAKININIZ)",
      kvkk: "HUJAM etkinlik kurallarını okudum ve kabul ediyorum. Kişisel verilerimin organizasyon kapsamında işlenmesine ve resmi kanallardan benimle iletişime geçilmesine izin veriyorum.",
      next: "SONRAKİ ADIM",
      back: "GERİ GİT",
      submit: "BAŞVURUYU TAMAMLA",
      sending: "VERİ AKTARILIYOR...",
      successTitle: "BAŞVURU BAŞARILI",
      successDesc: "Takım kaydınız başarıyla sistemlerimize işlendi. En kısa sürede sizinle iletişime geçeceğiz.",
      home: "ANA SAYFA",
      searchUni: "ÜNİVERSİTE ARA...",
      noUniFound: "ÜNİVERSİTE BULUNAMADI..."
    },
    en: {
      registryTitle: "SYSTEM_REGISTRY_V2.0",
      apply: "APPLICATION",
      progress: "TRANSMISSION_PROGRESS",
      captainOnly: "Applications must be made by team captains on behalf of their teams. The organization will communicate with the team captain throughout the process.",
      step1: "TEAM INFO",
      step2: "TEAM MEMBERS",
      step3: "EXPERIENCE",
      step4: "SERVER REQUEST",
      step5: "HEALTH & CONSENT",
      teamName: "TEAM NAME *",
      teamSize: "TOTAL MEMBERS (INC. CAPTAIN) *",
      captainInfo: "TEAM CAPTAIN (PERSON 01)",
      nameLabel: "FULL NAME *",
      emailLabel: "EMAIL ADDRESS *",
      phoneLabel: "PHONE NUMBER *",
      uniLabel: "UNIVERSITY *",
      deptLabel: "DEPARTMENT *",
      gradeLabel: "GRADE *",
      memberInfo: "MEMBER",
      prevPart: "HAVE YOU PARTICIPATED IN HUJAM BEFORE? *",
      prevPartNo: "No, everyone in the team is participating for the first time.",
      prevPartYesHujam: "Yes, there are members who participated in HUJAM before.",
      prevPartYesOther: "Yes, there are members who participated in other Game Jams.",
      expLabel: "PREVIOUS COMPETITION HISTORY / PORTFOLIO",
      expPlaceholder: "Briefly mention your experience or share project links if any...",
      serverReq: "DO YOU HAVE A SERVER REQUEST? *",
      serverNo: "No, we don't need one.",
      serverYes: "Yes, we request a server.",
      serverDetails: "REQUEST DETAILS (OS, vCPU, RAM, DISK) *",
      healthLabel: "PLEASE SPECIFY IF ANY MEMBER HAS SPECIAL CONDITIONS OR USES MEDICATION",
      healthPlaceholder: "Allergy, regular medication usage, etc...",
      healthWarning: "IMPORTANT: HUJAM team and organization cannot be held responsible for any problems that may occur during the event due to special conditions, chronic illnesses, or allergies not reported to the organization team. It is mandatory to follow recommendations provided by the organization for emergency situations and to share the contact number of a relative for emergencies.",
      emergencyContact: "EMERGENCY CONTACT NUMBER (RELATIVE)",
      kvkk: "I have read and accepted the HUJAM event rules. I allow my personal data to be processed within the scope of the organization and to be contacted through official channels.",
      next: "NEXT STEP",
      back: "GO BACK",
      submit: "COMPLETE APPLICATION",
      sending: "TRANSMITTING DATA...",
      successTitle: "APPLICATION SUCCESSFUL",
      successDesc: "Your team registration has been successfully processed. We will contact you as soon as possible.",
      home: "HOME PAGE",
      searchUni: "SEARCH UNIVERSITY...",
      noUniFound: "UNIVERSITY NOT FOUND..."
    }
  }[language];

  const formSteps = activeEvent?.formSteps && activeEvent.formSteps.length > 0 
    ? activeEvent.formSteps 
    : [
        { id: 1, title: t.step1 },
        { id: 2, title: t.step2 },
        { id: 3, title: t.step3 },
        { id: 4, title: t.step4 },
        { id: 5, title: t.step5 }
      ];

  const totalSteps = formSteps.length;

  const [formData, setFormData] = useState({
    teamName: '',
    teamCount: '2',
    captain: { name: '', email: '', phone: '', university: '', department: '', grade: '' },
    members: [] as any[],
    previousParticipation: 'no',
    experience: '',
    serverRequest: { requested: 'no', details: '' },
    healthCondition: '',
    emergencyPhone: '',
    kvkkConfirmed: false,
    answers: {} as Record<string, any>
  });

  useEffect(() => {
    const count = parseInt(formData.teamCount) || 1;
    const currentMembers = [...formData.members];
    const memberCountNeeded = count - 1;

    if (memberCountNeeded < 0) return;

    if (currentMembers.length < memberCountNeeded) {
      const diff = memberCountNeeded - currentMembers.length;
      const newMembers = Array(diff).fill(0).map(() => ({
        name: '', email: '', phone: '', university: '', department: ''
      }));
      setFormData(prev => ({ ...prev, members: [...prev.members, ...newMembers] }));
    } else if (currentMembers.length > memberCountNeeded) {
      setFormData(prev => ({ ...prev, members: prev.members.slice(0, memberCountNeeded) }));
    }
  }, [formData.teamCount]);

  const handleCaptainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, captain: { ...prev.captain, [name]: value } }));
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, members: updatedMembers }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) { setCurrentStep(prev => prev + 1); return; }
    if (!formData.kvkkConfirmed) return;

    setIsSubmitting(true);
    try {
      if (!activeEvent?.id) throw new Error("Etkinlik bulunamadı.");
      await addDoc(collection(db, `events/${activeEvent.id}/applications`), {
        ...formData,
        status: 'Pending',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorModal({ isOpen: true, message: "Başvuru gönderilirken bir hata oluştu." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  if (!activeEvent || !activeEvent.applicationsOpen) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <AlertCircle className="w-20 h-20 text-cyber-red mx-auto animate-pulse" />
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">SİSTEM ÇEVRİMDIŞI</h1>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-cyber-red/20 rounded-full flex items-center justify-center mx-auto border-2 border-cyber-red/50 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
            <CheckCircle2 size={48} className="text-cyber-red" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{t.successTitle}</h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed font-sans font-medium">
              {t.successDesc}
            </p>
          </div>
          <GameButton onClick={() => navigate('/')} className="mx-auto">
            {t.home}
          </GameButton>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full bg-zinc-950/50 border border-white/5 p-4 text-white text-sm focus:border-cyber-red focus:bg-zinc-900/80 outline-none transition-all placeholder:text-zinc-800 font-sans backdrop-blur-sm hover:border-white/10";
  const labelClasses = "text-[13px] text-zinc-300 font-bold uppercase tracking-wider mb-3 flex items-center gap-2 group-hover:text-cyber-red transition-colors font-sans";

  const UniversitySelect = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const selectedUni = universities.find(u => u.UniversityName === value);
    const filteredUnis = universities.filter(u => u.UniversityName.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="group relative">
        <label className={labelClasses}>{label}</label>
        <div className="relative">
          <input type="text" value={value} required className="absolute opacity-0 w-full h-full -z-10" onChange={() => {}} />
          <div onClick={() => setIsOpen(!isOpen)} className={`${inputClasses} cursor-pointer flex items-center justify-between gap-3`}>
            <div className="flex items-center gap-3 overflow-hidden">
              {selectedUni && <img src={selectedUni.University_logourl} alt="" className="w-6 h-6 object-contain shrink-0 bg-white/10 rounded-full" />}
              <span className={value ? 'text-white' : 'text-zinc-600'}>{value || "Üniversite seçiniz..."}</span>
            </div>
            <ChevronRight className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} size={16} />
          </div>
          {isOpen && (
            <div className="absolute top-full left-0 w-full z-50 bg-zinc-900 border border-white/10 shadow-2xl mt-1">
              <input autoFocus type="text" placeholder={t.searchUni} value={search} onChange={(e) => setSearch(e.target.value.toUpperCase())} className="w-full bg-black border-b border-white/5 p-4 text-xs font-black text-cyber-red outline-none" />
              <div className="max-h-60 overflow-y-auto">
                {filteredUnis.map(uni => (
                  <div key={uni.UniversityUid} onClick={() => { onChange(uni.UniversityName); setIsOpen(false); setSearch(""); }} className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5">
                    <img src={uni.University_logourl} alt="" className="w-8 h-8 object-contain bg-white/10 p-1 rounded" />
                    <span className="text-[10px] font-black text-white uppercase">{uni.UniversityName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans py-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-red/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-3xl mx-auto relative z-50">
        <button 
          type="button"
          onClick={() => navigate('/')} 
          className="absolute -top-12 right-0 flex items-center gap-2 text-zinc-600 hover:text-cyber-red transition-all group px-4 py-2 z-[100] cursor-pointer cursor-auto pointer-events-auto"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">KAPAT</span>
          <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <span className="w-2 h-2 bg-cyber-red animate-pulse" />
                 <span className="text-cyber-red font-mono text-[10px] font-black tracking-[0.3em] uppercase">{t.registryTitle}</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                 {activeEvent.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-red to-red-800">{t.apply}</span>
               </h1>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-600 font-black mb-1 tracking-widest uppercase">{t.progress}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white leading-none">0{currentStep}</span>
                  <span className="text-xl font-black text-gray-800 leading-none">/ 0{totalSteps}</span>
                </div>
             </div>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-4">
             {formSteps.map((step, idx) => {
               const isActive = currentStep === step.id;
               const isPast = currentStep > step.id;
               return (
                 <div key={step.id} className="space-y-2">
                   <div className={`h-1 transition-all duration-500 ${isActive ? 'bg-cyber-red shadow-[0_0_10px_rgba(255,0,0,0.5)]' : isPast ? 'bg-cyber-red/40' : 'bg-white/5'}`} />
                   <span className={`hidden md:block text-[8px] font-black uppercase tracking-tighter truncate ${isActive ? 'text-white' : 'text-gray-700'}`}>
                     {idx + 1}. {step.title.split(' ')[0]}
                   </span>
                 </div>
               );
             })}
          </div>
          <div className="group relative">
            <div className="relative bg-cyber-red/5 text-cyber-red p-4 border border-cyber-red/20 flex items-center gap-3">
              <AlertCircle size={16} className="shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-normal">{t.captainOnly}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/10 border border-white/5 p-8 md:p-12 relative">
          <div className="mb-4">
             <h2 className="text-white font-black text-lg uppercase tracking-tight italic border-l-4 border-cyber-red pl-4">
                {formSteps.find(s => s.id === currentStep)?.title}
             </h2>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="group">
                  <label className={labelClasses}><Users size={14} /> {t.teamName}</label>
                  <input type="text" required value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} className={inputClasses} />
               </div>
               <div className="group">
                  <label className={labelClasses}><Users size={14} /> {t.teamSize}</label>
                   <select required value={formData.teamCount} onChange={e => setFormData({...formData, teamCount: e.target.value})} className={`${inputClasses} appearance-none cursor-pointer`}>
                      <option value="1" className="bg-zinc-900">1</option>
                      <option value="2" className="bg-zinc-900">2</option>
                      <option value="3" className="bg-zinc-900">3</option>
                      <option value="4" className="bg-zinc-900">4</option>
                      <option value="5" className="bg-zinc-900">5</option>
                   </select>
               </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-6">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2 border-b border-white/10 pb-2">
                    <User size={16} className="text-cyber-red" /> {t.captainInfo}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group"><label className={labelClasses}>{t.nameLabel}</label><input type="text" name="name" required value={formData.captain.name} onChange={handleCaptainChange} className={inputClasses} /></div>
                    <div className="group"><label className={labelClasses}>{t.emailLabel}</label><input type="email" name="email" required value={formData.captain.email} onChange={handleCaptainChange} className={inputClasses} /></div>
                    <div className="group"><label className={labelClasses}>{t.phoneLabel}</label><input type="tel" name="phone" required value={formData.captain.phone} onChange={handleCaptainChange} className={inputClasses} /></div>
                    <UniversitySelect label={t.uniLabel} value={formData.captain.university} onChange={(val) => setFormData(prev => ({ ...prev, captain: { ...prev.captain, university: val } }))} />
                    <div className="group"><label className={labelClasses}>{t.deptLabel}</label><input type="text" name="department" required value={formData.captain.department} onChange={handleCaptainChange} className={inputClasses} /></div>
                    <div className="group">
                      <label className={labelClasses}>{t.gradeLabel}</label>
                      <select name="grade" required value={formData.captain.grade} onChange={handleCaptainChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                        <option value="" className="bg-zinc-900">{language === 'tr' ? 'Seçiniz...' : 'Select...'}</option>
                        <option value="Hazırlık" className="bg-zinc-900">{language === 'tr' ? 'Hazırlık' : 'Pre-school'}</option>
                        <option value="1. Sınıf" className="bg-zinc-900">1. {language === 'tr' ? 'Sınıf' : 'Grade'}</option>
                        <option value="2. Sınıf" className="bg-zinc-900">2. {language === 'tr' ? 'Sınıf' : 'Grade'}</option>
                        <option value="3. Sınıf" className="bg-zinc-900">3. {language === 'tr' ? 'Sınıf' : 'Grade'}</option>
                        <option value="4. Sınıf" className="bg-zinc-900">4. {language === 'tr' ? 'Sınıf' : 'Grade'}</option>
                        <option value="5. Sınıf" className="bg-zinc-900">5. {language === 'tr' ? 'Sınıf' : 'Grade'}</option>
                        <option value="6. Sınıf" className="bg-zinc-900">6. {language === 'tr' ? 'Sınıf' : 'Grade'}</option>
                      </select>
                    </div>
                  </div>
               </div>
               {formData.members.map((member, i) => (
                 <div key={i} className="space-y-6 pt-4 border-t border-white/5">
                   <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                     <Users size={16} className="text-zinc-600" /> {t.memberInfo} {i + 2}
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="group"><label className={labelClasses}>{t.nameLabel}</label><input type="text" required value={formData.members[i].name} onChange={e => handleMemberChange(i, 'name', e.target.value)} className={inputClasses} /></div>
                     <div className="group"><label className={labelClasses}>{t.emailLabel}</label><input type="email" required value={formData.members[i].email} onChange={e => handleMemberChange(i, 'email', e.target.value)} className={inputClasses} /></div>
                     <div className="group"><label className={labelClasses}>{t.phoneLabel}</label><input type="tel" required value={formData.members[i].phone} onChange={e => handleMemberChange(i, 'phone', e.target.value)} className={inputClasses} /></div>
                     <UniversitySelect label={t.uniLabel} value={formData.members[i].university} onChange={(val) => handleMemberChange(i, 'university', val)} />
                     <div className="group md:col-span-2"><label className={labelClasses}>{t.deptLabel}</label><input type="text" required value={member.department} onChange={e => handleMemberChange(i, 'department', e.target.value)} className={inputClasses} /></div>
                   </div>
                 </div>
               ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="group">
                  <label className={labelClasses}><History size={14} /> {t.prevPart}</label>
                  <select value={formData.previousParticipation} onChange={e => setFormData({...formData, previousParticipation: e.target.value})} className={`${inputClasses} appearance-none cursor-pointer`}>
                    <option value="no" className="bg-zinc-900">{t.prevPartNo}</option>
                    <option value="yes_hujam" className="bg-zinc-900">{t.prevPartYesHujam}</option>
                    <option value="yes_other" className="bg-zinc-900">{t.prevPartYesOther}</option>
                  </select>
               </div>
               <div className="group">
                  <label className={labelClasses}><Terminal size={14} /> {t.expLabel}</label>
                  <textarea value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} rows={4} className={`${inputClasses} resize-none`} placeholder={t.expPlaceholder} />
               </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="group">
                  <label className={labelClasses}>{t.serverReq}</label>
                  <select value={formData.serverRequest.requested} onChange={e => setFormData({...formData, serverRequest: {...formData.serverRequest, requested: e.target.value}})} className={`${inputClasses} appearance-none cursor-pointer`}>
                    <option value="no" className="bg-zinc-900">{t.serverNo}</option>
                    <option value="yes" className="bg-zinc-900">{t.serverYes}</option>
                  </select>
               </div>
               {formData.serverRequest.requested === 'yes' && (
                  <div className="group">
                     <label className={labelClasses}><Cpu size={14} /> {t.serverDetails}</label>
                     <textarea required value={formData.serverRequest.details} onChange={e => setFormData({...formData, serverRequest: {...formData.serverRequest, details: e.target.value}})} className={`${inputClasses} resize-none`} rows={3} />
                  </div>
               )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="group">
                   <label className={labelClasses}><ShieldPlus size={14} /> {t.healthLabel}</label>
                   <div className="mb-4 mt-2 p-4 bg-zinc-900/30 border border-white/5 text-[11px] text-zinc-400 font-sans leading-relaxed">
                      <strong className="text-white uppercase tracking-widest block text-[12px] mb-2">{language === 'tr' ? 'ACİL DURUM VE SAĞLIK BİLDİRİMİ' : 'EMERGENCY & HEALTH NOTICE'}</strong>
                      <p>{t.healthWarning}</p>
                   </div>
                   <textarea value={formData.healthCondition} onChange={e => setFormData({...formData, healthCondition: e.target.value})} rows={3} className={`${inputClasses} resize-none mb-6`} placeholder={t.healthPlaceholder} />
                   
                   <div className="mb-6">
                     <label className={labelClasses}><Phone size={14} /> {t.emergencyContact}</label>
                     <input 
                       type="tel" 
                       value={formData.emergencyPhone} 
                       onChange={e => setFormData({...formData, emergencyPhone: e.target.value})} 
                       className={inputClasses} 
                       placeholder="Örn: 05XX XXX XX XX"
                     />
                   </div>
                </div>
               <div className="space-y-4 pt-6">
                  <label className="flex items-start gap-4 p-5 bg-cyber-red/5 border border-cyber-red/20 cursor-pointer group hover:bg-cyber-red/10 transition-all">
                    <input type="checkbox" required checked={formData.kvkkConfirmed} onChange={e => setFormData({...formData, kvkkConfirmed: e.target.checked})} className="mt-1" />
                    <span className="text-[11px] text-gray-400 leading-relaxed font-sans font-bold">
                       {t.kvkk} <span className="text-cyber-red block mt-2 tracking-widest uppercase">// KVKK_VE_KATILIM_SÖZLEŞMESİ</span>
                    </span>
                  </label>
               </div>
               <div className="pt-4">
                  <GameButton type="submit" variant="primary" className="w-full justify-center py-6 text-2xl font-black" disabled={isSubmitting}>
                     {isSubmitting ? t.sending : t.submit}
                  </GameButton>
               </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-8 border-t border-white/5">
            {currentStep > 1 && (
              <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px]">
                <ChevronLeft size={16} /> {t.back}
              </button>
            )}
            <div className="flex-1" />
            {currentStep < totalSteps && (
              <button type="submit" className="flex items-center gap-2 text-cyber-red hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] bg-cyber-red/5 px-6 py-3 border border-cyber-red/20">
                {t.next} <ChevronRight size={16} />
              </button>
            )}
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-10 flex justify-between items-center opacity-30 font-mono text-[9px] uppercase tracking-[0.3em]">
          <span>© HUJAM_SYSTEMS</span>
          <span className="text-cyber-red">STATUS: SECURE_CONNECTION</span>
        </div>
      </div>
      
      <AlertModal 
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title="İŞLEM HATASI"
        message={errorModal.message}
      />
    </div>
  );
};
