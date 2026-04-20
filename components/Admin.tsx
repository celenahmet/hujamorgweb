import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { db, auth } from '../firebase';
import { 
  collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc,
  Timestamp, setDoc, serverTimestamp, getDoc
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  LayoutDashboard, Users, MessageSquare, LogOut, CheckCircle, XCircle, Clock, ChevronRight,
  Search, ArrowUpRight, Terminal, ShieldPlus, Plus, X, Loader2, MapPin, CalendarDays, 
  ToggleLeft, ToggleRight, Eye, EyeOff, Save, Trash2, HelpCircle, Pencil, ListTodo, Settings2, GripVertical, Activity, Settings, ShieldCheck, ArrowRight, Download, Info, Phone, FileText, ChevronDown, StickyNote, PhoneCall
} from 'lucide-react';
import { useActiveEvent, ActiveEventData } from './EventContext';
import { GameButton } from './ui/GameButton';
import universitiesData from '../data/universities.json';
import hujamLogo from '../assets/logo/hujamlogo.png';

const universities = universitiesData as any[];

// Toast Component
const Toast: React.FC<{message: string, type: 'success' | 'error', onClose: () => void}> = ({message, type, onClose}) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded shadow-2xl border flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${type === 'success' ? 'bg-zinc-900 border-green-500/50 text-green-400' : 'bg-zinc-900 border-red-500/50 text-red-400'}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-bold text-sm uppercase tracking-wider">{message}</span>
    </div>
  );
};

const generateIdFromTitle = (title: string) => {
  return title.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/hujam20(\d{2})/, 'hujam$1');
};

export const Admin: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'applications' | 'faqs' | 'lobby' | 'messages' | 'sponsors'>('events');
  const [appItems, setAppItems] = useState<any[]>([]);
  const [lobbyItems, setLobbyItems] = useState<any[]>([]);
  const [messageItems, setMessageItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>("hujam26");
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({ id: '', title: '', eventDate: '', eventLocation: '', eventLocationUrl: '', latitude: '', longitude: '', description: '', lobbyOpen: false });

  // Event detail editing
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // FAQ & Questions management state (for the dedicated tab)
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newQuestion, setNewQuestion] = useState({ label: '', placeholder: '', type: 'text' as const, required: true, options: '' });
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Application tracking states
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [xlsxDropdownOpen, setXlsxDropdownOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [draggedSponsorIdx, setDraggedSponsorIdx] = useState<number | null>(null);

  // Custom Login State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('hujam_admin_auth') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const docRef = doc(db, 'admin_login', adminUsername);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.data().password === adminPassword) {
          setIsLoggedIn(true);
          localStorage.setItem('hujam_admin_auth', 'true');
        } else {
          setLoginError('Hatalı şifre.');
        }
      } else {
        setLoginError('Kullanıcı bulunamadı.');
      }
    } catch (err) {
      setLoginError('Sistem hatası. Lütfen ağ bağlantınızı kontrol edin.');
    }
    setIsLoggingIn(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return () => unsub();
  }, []);

  useEffect(() => {
    const eventsQuery = collection(db, 'events');
    const unsub = onSnapshot(eventsQuery, (snapshot) => {
      const evs = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data } as ActiveEventData;
      });
      // Sort manually to handle missing timestamps
      evs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      // Ensure HUJAM'25/26 is always available in Admin for Lobby/Application management
      const hasHujamMain = evs.some(e => e.id === 'hujam26' || e.id === 'hujam25' || e.title.includes('25'));
      const finalEvents = hasHujamMain 
        ? evs 
        : [{ id: 'hujam26', title: "HUJAM'25", isActive: false, applicationsOpen: true, lobbyOpen: true } as any, ...evs];

      setEvents(finalEvents);
      
      if (!selectedEventId && finalEvents.length > 0) {
        // Prioritize finding HUJAM 26 or 25 in the list
        const hujamMain = finalEvents.find((e: any) => e.id === 'hujam26') || finalEvents.find((e: any) => e.id === 'hujam25') || finalEvents.find((e: any) => e.title.includes('25'));
        const activeOne = finalEvents.find((e: any) => e.isActive);
        setSelectedEventId(hujamMain ? hujamMain.id : (activeOne ? activeOne.id : finalEvents[0].id));
      }
    });
    return () => unsub();
  }, []); // Only once at mount

  useEffect(() => {
    if (activeTab === 'applications' && selectedEventId) {
      const q = collection(db, `events/${selectedEventId}/applications`);
      return onSnapshot(q, (s) => {
        const data = s.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis?.() || new Date(a.submittedAt || 0).getTime() || 0;
          const timeB = b.createdAt?.toMillis?.() || new Date(b.submittedAt || 0).getTime() || 0;
          return timeB - timeA;
        });
        setAppItems(data);
      });
    }
  }, [selectedEventId, activeTab]);

  useEffect(() => {
    if (activeTab === 'lobby' && selectedEventId) {
      const q = collection(db, `events/${selectedEventId}/lobby`);
      console.log(`FETCHING LOBY FROM: events/${selectedEventId}/lobby`);
      return onSnapshot(q, (s) => {
        console.log(`LOBY DOCS RECEIVED: ${s.docs.length}`);
        const data = s.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis?.() || new Date(a.submittedAt || 0).getTime() || 0;
          const timeB = b.createdAt?.toMillis?.() || new Date(b.submittedAt || 0).getTime() || 0;
          return timeB - timeA;
        });
        setLobbyItems(data);
      });
    }
  }, [selectedEventId, activeTab]);

  useEffect(() => {
    if (activeTab === 'messages') {
      const q = collection(db, 'HUJAM_WEB');
      return onSnapshot(q, (s) => {
        const data = s.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis?.() || new Date(a.submittedAt || 0).getTime() || 0;
          const timeB = b.createdAt?.toMillis?.() || new Date(b.submittedAt || 0).getTime() || 0;
          return timeB - timeA;
        });
        setMessageItems(data);
      });
    }
  }, [activeTab]);

  const getOS = (ua: string) => {
    if (!ua) return 'UNKNOWN';
    if (ua.includes('Win')) return 'WINDOWS';
    if (ua.includes('Mac')) return 'MAC_OS';
    if (ua.includes('Linux')) return 'LINUX';
    if (ua.includes('Android')) return 'ANDROID';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'IOS';
    return 'OTHER';
  };

  // ============ TRACKING HELPERS ============
  const updateTracking = async (id: string, field: string, value: any) => {
    if (!selectedEventId) return;
    try {
      await setDoc(doc(db, `events/${selectedEventId}/applications`, id), { [field]: value }, { merge: true });
      setToast({ message: `${field === 'confirmed' ? 'Teyit' : field === 'called' ? 'Arama' : 'Not'} güncellendi.`, type: 'success' });
    } catch { setToast({ message: 'Güncelleme hatası.', type: 'error' }); }
  };

  const saveNote = async (id: string) => {
    await updateTracking(id, 'adminNote', tempNote);
    setEditingNoteId(null);
  };

  // ============ XLSX EXPORT HELPERS ============
  const buildDetailedRows = () => {
    const rows: any[] = [];
    appItems.forEach((app: any, idx: number) => {
      const base = {
        '#': idx + 1,
        'Takım Adı': app.teamName || '',
        'Kişi Sayısı': app.teamCount || '',
        'Durum': app.status === 'Approved' ? 'Onaylandı' : app.status === 'Rejected' ? 'Reddedildi' : 'Bekliyor',
        'Teyit': app.confirmed ? 'Evet' : 'Hayır',
        'Arandı': app.called ? 'Evet' : 'Hayır',
        'Admin Notu': app.adminNote || '',
        'Tecrübe': app.experience || '',
        'Önceki Katılım': app.previousParticipation || '',
        'Sunucu Talebi': app.serverRequest?.requested || 'Hayır',
        'Sunucu Detay': app.serverRequest?.details || '',
        'Sağlık Durumu': app.healthCondition || '',
        'Acil İletişim': app.emergencyPhone || '',
        'Kayıt Tarihi': app.createdAt?.toDate ? app.createdAt.toDate().toLocaleString('tr-TR') : '',
      };
      if (app.captain) {
        rows.push({ ...base, 'Rol': 'Kaptan', 'Ad Soyad': app.captain.name, 'E-Posta': app.captain.email, 'Telefon': app.captain.phone, 'Üniversite': app.captain.university, 'Bölüm': app.captain.department, 'Sınıf': app.captain.grade });
      }
      if (app.members && Array.isArray(app.members)) {
        app.members.forEach((m: any, i: number) => {
          rows.push({ ...base, 'Rol': `Üye ${i + 2}`, 'Ad Soyad': m.name, 'E-Posta': m.email, 'Telefon': m.phone, 'Üniversite': m.university, 'Bölüm': m.department, 'Sınıf': m.grade || '' });
        });
      }
    });
    return rows;
  };

  const buildRosterRows = () => {
    return appItems.map((app: any, idx: number) => ({
      '#': idx + 1,
      'Takım Adı': app.teamName || '',
      'Kaptan': app.captain?.name || '',
      'Kaptan E-Posta': app.captain?.email || '',
      'Kaptan Telefon': app.captain?.phone || '',
      'Üniversite': app.captain?.university || '',
      'Kişi Sayısı': app.teamCount || 1,
      'Sunucu': app.serverRequest?.requested === 'yes' ? 'Evet' : 'Hayır',
      'Durum': app.status === 'Approved' ? 'Onaylandı' : app.status === 'Rejected' ? 'Reddedildi' : 'Bekliyor',
      'Teyit': app.confirmed ? 'Evet' : 'Hayır',
      'Arandı': app.called ? 'Evet' : 'Hayır',
      'Admin Notu': app.adminNote || '',
      'Tarih': app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString('tr-TR') : '',
    }));
  };

  const exportApplicationsToXlsx = (mode: 'detailed' | 'roster' | 'combined') => {
    if (appItems.length === 0) { setToast({ message: 'İndirilecek veri yok.', type: 'error' }); return; }
    const wb = XLSX.utils.book_new();
    const date = new Date().toISOString().slice(0, 10);
    if (mode === 'detailed' || mode === 'combined') {
      const ws = XLSX.utils.json_to_sheet(buildDetailedRows());
      XLSX.utils.book_append_sheet(wb, ws, 'Detaylı Başvurular');
    }
    if (mode === 'roster' || mode === 'combined') {
      const ws2 = XLSX.utils.json_to_sheet(buildRosterRows());
      XLSX.utils.book_append_sheet(wb, ws2, 'Takım Listesi');
    }
    XLSX.writeFile(wb, `HUJAM_${mode === 'detailed' ? 'Detayli' : mode === 'roster' ? 'TakimListesi' : 'Komple'}_${date}.xlsx`);
    setToast({ message: 'Dışa aktarıldı.', type: 'success' });
    setXlsxDropdownOpen(false);
  };

  const exportLobbyToXlsx = () => {
    if (lobbyItems.length === 0) { setToast({ message: 'İndirilecek veri yok.', type: 'error' }); return; }
    const rows = lobbyItems.map((item: any) => ({
      'Kullanıcı': item.userName || '',
      'Rol': item.role || '',
      'Durum': item.intent === 'looking-for-team' ? 'Takım Arıyor' : 'Üye Arıyor',
      'Yetenekler': item.skills || '',
      'Açıklama': item.description || '',
      'İletişim': item.contact || '',
      'IP': item.ipv4 || '',
      'İşletim Sistemi': getOS(item.userAgent),
      'Tarih': item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString('tr-TR') : (item.submittedAt || ''),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lobi İlanları');
    XLSX.writeFile(wb, `HUJAM_Lobi_${new Date().toISOString().slice(0,10)}.xlsx`);
    setToast({ message: `${rows.length} ilan dışa aktarıldı.`, type: 'success' });
  };

  const handleLogout = () => signOut(auth);

  const updateStatus = async (id: string, status: string) => {
    if (!selectedEventId) return;
    try {
      await setDoc(doc(db, `events/${selectedEventId}/applications`, id), { status }, { merge: true });
      setToast({ message: `Durum: ${status}`, type: 'success' });
    } catch { setToast({ message: "Hata oluştu.", type: 'error' }); }
  };

  const deleteItem = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      let path = '';
      if (activeTab === 'applications') path = `events/${selectedEventId}/applications`;
      else if (activeTab === 'lobby') path = `events/${selectedEventId}/lobby`;
      else path = 'HUJAM_WEB';
      
      await deleteDoc(doc(db, path, deleteConfirmId));
      setToast({ message: "Kayıt silindi.", type: 'success' });
    } catch { setToast({ message: "Silme başarısız.", type: 'error' }); }
    setDeleteConfirmId(null);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.id || !newEvent.title) return;
    setIsCreating(true);
    try {
      await setDoc(doc(db, 'events', newEvent.id.toLowerCase().trim()), {
        title: newEvent.title.trim(),
        eventDate: newEvent.eventDate,
        eventLocation: newEvent.eventLocation,
        eventLocationUrl: newEvent.eventLocationUrl,
        latitude: newEvent.latitude,
        longitude: newEvent.longitude,
        description: newEvent.description,
        isActive: false,
        applicationsOpen: false,
        lobbyOpen: newEvent.lobbyOpen || false,
        faqs: [],
        customQuestions: [],
        formSteps: [
          { id: 1, title: 'TAKIM BİLGİSİ' },
          { id: 2, title: 'EKİP ÜYELERİ' },
          { id: 3, title: 'DENEYİM' },
          { id: 4, title: 'SUNUCU TALEBİ' },
          { id: 5, title: 'SAĞLIK & ONAY' }
        ],
        createdAt: serverTimestamp()
      });
      setToast({ message: "Etkinlik oluşturuldu.", type: 'success' });
      setIsModalOpen(false);
      setNewEvent({ id: '', title: '', eventDate: '', eventLocation: '', eventLocationUrl: '', latitude: '', longitude: '', description: '', lobbyOpen: false });
    } catch (err: any) {
      setToast({ message: "Hata: " + err.message, type: 'error' });
    } finally { setIsCreating(false); }
  };

  const openEventEditor = (event: any) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title || '',
      eventDate: event.eventDate || '',
      eventLocation: event.eventLocation || '',
      eventLocationUrl: event.eventLocationUrl || '',
      latitude: event.latitude || '',
      longitude: event.longitude || '',
      description: event.description || '',
      isActive: event.isActive || false,
      applicationsOpen: event.applicationsOpen || false,
      lobbyOpen: event.lobbyOpen || false
    });
  };

  const saveEventChanges = async () => {
    if (!editingEvent) return;
    
    if (editForm.isActive) {
      const activeExists = events.some((ev: any) => ev.id !== editingEvent.id && ev.isActive);
      if (activeExists) {
        setToast({ message: "Yayında zaten başka bir etkinlik var. Lütfen önce onu yayından kaldırın.", type: 'error' });
        return;
      }
    }
    
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'events', editingEvent.id), {
        title: editForm.title,
        eventDate: editForm.eventDate,
        eventLocation: editForm.eventLocation,
        eventLocationUrl: editForm.eventLocationUrl,
        latitude: editForm.latitude,
        longitude: editForm.longitude,
        description: editForm.description,
        isActive: editForm.isActive,
        applicationsOpen: editForm.applicationsOpen,
        lobbyOpen: editForm.lobbyOpen
      }, { merge: true });
      setToast({ message: "Etkinlik güncellendi.", type: 'success' });
      setEditingEvent(null);
    } catch (err: any) {
      setToast({ message: "Kaydetme hatası: " + err.message, type: 'error' });
    } finally { setIsSaving(false); }
  };

  const updateSelectedEventField = async (field: 'faqs' | 'customQuestions' | 'formSteps' | 'sponsors' | 'organizers', data: any[]) => {
    if (!selectedEventId) return;
    try {
      await setDoc(doc(db, 'events', selectedEventId), { [field]: data }, { merge: true });
      setToast({ message: "Güncellendi.", type: 'success' });
    } catch (err: any) {
      setToast({ message: "Hata: " + err.message, type: 'error' });
    }
  };

  const moveArrayItem = (field: 'faqs' | 'sponsors' | 'organizers' | 'customQuestions', index: number, direction: 'up' | 'down') => {
    if (!currentEventData) return;
    const items = [...(currentEventData[field] || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    updateSelectedEventField(field, items);
  };

  const handleDropSponsor = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedSponsorIdx === null || draggedSponsorIdx === index || !currentEventData?.sponsors) return;
    const items = [...currentEventData.sponsors];
    const draggedItem = items[draggedSponsorIdx];
    items.splice(draggedSponsorIdx, 1);
    items.splice(index, 0, draggedItem);
    await updateSelectedEventField('sponsors', items);
    setDraggedSponsorIdx(null);
  };

  const addFaq = () => {
    if (!newFaq.question || !newFaq.answer || !selectedEventId) return;
    const currentEvent = events.find(e => e.id === selectedEventId);
    const existingFaqs = currentEvent?.faqs || [];
    updateSelectedEventField('faqs', [...existingFaqs, { ...newFaq }]);
    setNewFaq({ question: '', answer: '' });
  };

  const removeFaq = (idx: number) => {
    const currentEvent = events.find(e => e.id === selectedEventId);
    if (!currentEvent) return;
    const faqsCopy = [...currentEvent.faqs];
    faqsCopy.splice(idx, 1);
    updateSelectedEventField('faqs', faqsCopy);
  };

  const addCustomQuestion = () => {
    if (!newQuestion.label || !selectedEventId) return;
    const currentEvent = events.find(e => e.id === selectedEventId);
    const existingQuestions = [...(currentEvent?.customQuestions || [])];
    
    const qObj = {
      id: editingQuestionId || Math.random().toString(36).substring(7),
      label: newQuestion.label,
      placeholder: newQuestion.placeholder,
      type: newQuestion.type,
      required: newQuestion.required,
      options: newQuestion.options ? newQuestion.options.split(',').map(o => o.trim()) : []
    };

    if (editingQuestionId) {
      const idx = existingQuestions.findIndex(q => q.id === editingQuestionId);
      if (idx !== -1) existingQuestions[idx] = qObj;
    } else {
      existingQuestions.push(qObj);
    }

    updateSelectedEventField('customQuestions', existingQuestions);
    setNewQuestion({ label: '', placeholder: '', type: 'text', required: true, options: '' });
    setEditingQuestionId(null);
  };

  const removeCustomQuestion = (qId: string) => {
    if (!currentEventData) return;
    updateSelectedEventField('customQuestions', currentEventData.customQuestions.filter((q: any) => q.id !== qId));
    if (editingQuestionId === qId) {
      setEditingQuestionId(null);
      setNewQuestion({ label: '', placeholder: '', type: 'text', required: true, options: '' });
    }
  };

  const editCustomQuestion = (q: any) => {
    setEditingQuestionId(q.id);
    setNewQuestion({
      label: q.label,
      placeholder: q.placeholder,
      type: q.type,
      required: q.required,
      options: q.options ? q.options.join(', ') : ''
    });
  };


  const updateStepTitle = (stepId: number, newTitle: string) => {
    if (!selectedEventId) return;
    const currentEvent = events.find(e => e.id === selectedEventId);
    const steps = [...(currentEvent?.formSteps || [])];
    const idx = steps.findIndex(s => s.id === stepId);
    if (idx !== -1) {
      steps[idx] = { ...steps[idx], title: newTitle };
    } else {
      steps.push({ id: stepId, title: newTitle });
    }
    updateSelectedEventField('formSteps', steps);
  };

  const [newSponsor, setNewSponsor] = useState({ name: '', tier: 'gold', logoUrl: '' });
  const [newOrganizer, setNewOrganizer] = useState({ name: '', role: '' });

  const addSponsor = () => {
    if (!newSponsor.name || !selectedEventId) return;
    const currentEvent = events.find(e => e.id === selectedEventId);
    const existing = [...(currentEvent?.sponsors || [])];
    existing.push({ id: Math.random().toString(36).substring(7), ...newSponsor });
    updateSelectedEventField('sponsors', existing);
    setNewSponsor({ name: '', tier: 'gold', logoUrl: '' });
  };

  const removeSponsor = (id: string) => {
    if (!currentEventData) return;
    updateSelectedEventField('sponsors', currentEventData.sponsors.filter((s: any) => s.id !== id));
  };

  const addOrganizer = () => {
    if (!newOrganizer.name || !selectedEventId) return;
    const currentEvent = events.find(e => e.id === selectedEventId);
    const existing = [...(currentEvent?.organizers || [])];
    existing.push({ id: Math.random().toString(36).substring(7), ...newOrganizer });
    updateSelectedEventField('organizers', existing);
    setNewOrganizer({ name: '', role: '' });
  };

  const removeOrganizer = (id: string) => {
    if (!currentEventData) return;
    updateSelectedEventField('organizers', currentEventData.organizers.filter((o: any) => o.id !== id));
  };

  const filteredApps = appItems.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredLobby = lobbyItems.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredMessages = messageItems.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-cyber-red font-mono animate-pulse tracking-widest text-sm">SYSTEM_CONNECTING...</div>;
  }

  if (!isLoggedIn) {
     return (
       <div className="min-h-screen bg-[#050505] text-gray-300 font-sans flex items-center justify-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-cyber-red opacity-50" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
         
         <div className="w-full max-w-md p-10 bg-zinc-950/90 backdrop-blur-md border border-white/10 relative z-10 shadow-[0_0_50px_rgba(255,0,60,0.1)]">
           <div className="absolute top-0 left-0 w-1 h-full bg-cyber-red" />
           <div className="flex flex-col items-center mb-10">
             <img src={hujamLogo} alt="HUJAM" className="h-12 mb-6 filter brightness-0 invert opacity-90" />
             <h1 className="text-xl font-black text-white uppercase tracking-widest">SYSTEM_REQUIRE_AUTH</h1>
             <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-2 uppercase">// AUTHENTICATION PROTOCOL</p>
           </div>
           
           <form onSubmit={handleAdminLogin} className="space-y-6">
             <div>
               <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">Kullanıcı Adı</label>
               <input 
                 type="text" 
                 value={adminUsername}
                 onChange={e => setAdminUsername(e.target.value)}
                 className="w-full bg-black border border-white/5 p-4 text-white text-sm focus:border-cyber-red outline-none transition-all placeholder:text-zinc-700" 
                 required 
               />
             </div>
             <div>
               <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">Yönetici Şifresi</label>
               <input 
                 type="password" 
                 value={adminPassword}
                 onChange={e => setAdminPassword(e.target.value)}
                 className="w-full bg-black border border-white/5 p-4 text-white text-sm focus:border-cyber-red outline-none transition-all placeholder:text-zinc-700 font-mono" 
                 required 
               />
             </div>
             
             {loginError && (
               <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-500 text-[11px] font-mono tracking-wide text-center">
                 {loginError}
               </div>
             )}
             
             <GameButton type="submit" variant="primary" className="w-full py-4 justify-center" disabled={isLoggingIn}>
               {isLoggingIn ? <Loader2 className="animate-spin w-5 h-5" /> : 'GİRİŞ YAP'}
             </GameButton>
           </form>
         </div>
       </div>
     );
  }

  const currentEventData = events.find(e => e.id === selectedEventId);

  const inputCls = "w-full bg-black border border-white/5 p-3 text-white text-sm focus:border-cyber-red outline-none transition-all placeholder:text-zinc-700";
  const labelCls = "text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 block";

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans flex flex-col md:flex-row relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ========== MODALS ========== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyber-red" />
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight flex items-center gap-3"><Plus className="text-cyber-red" /> YENİ ETKİNLİK</h2>
            <p className="text-[10px] text-gray-600 font-mono mb-6 tracking-widest uppercase">// ETKINLIK_KAYIT_SISTEMI</p>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className={labelCls}>ETKİNLİK BAŞLIĞI</label>
                <input 
                  type="text" 
                  value={newEvent.title} 
                  onChange={e => {
                    const val = e.target.value;
                    const generatedId = val.toLowerCase()
                      .replace(/\s+/g, '')
                      .replace(/[^a-z0-9]/g, '')
                      .replace(/hujam20(\d{2})/, 'hujam$1')
                      .replace(/hujam(\d{4})/, 'hujam$1');
                    
                    setNewEvent({
                      ...newEvent, 
                      title: val,
                      id: newEvent.id === '' || newEvent.id === generateIdFromTitle(newEvent.title) ? generatedId : newEvent.id
                    });
                  }} 
                  className={inputCls} 
                  placeholder="örn: HUJAM'27"
                  required 
                />
              </div>
              <div>
                <label className={labelCls}>ETKİNLİK ID (BOŞLUKSUZ YIL ODAKLI)</label>
                <input 
                  type="text" 
                  value={newEvent.id} 
                  onChange={e => setNewEvent({...newEvent, id: e.target.value.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9-]/g, '')})} 
                  className={inputCls} 
                  placeholder="örn: hujam27"
                  required 
                />
              </div>
              <div><label className={labelCls}>Tarih</label><input type="text" value={newEvent.eventDate} onChange={e => setNewEvent({...newEvent, eventDate: e.target.value})} className={inputCls} placeholder="17-18 Mayıs 2025" /></div>
              <div><label className={labelCls}>Etkinlik Konum İsmi</label><input type="text" value={newEvent.eventLocation} onChange={e => setNewEvent({...newEvent, eventLocation: e.target.value})} className={inputCls} placeholder="örn: Tunçalp Özgen K.K.M." required /></div>
              <div><label className={labelCls}>Google Maps Harita Linki</label><input type="url" value={newEvent.eventLocationUrl} onChange={e => setNewEvent({...newEvent, eventLocationUrl: e.target.value})} className={inputCls} placeholder="https://maps.google.com/..." required /></div>
              <div><label className={labelCls}>Açıklama</label><textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className={`${inputCls} resize-none`} rows={3} /></div>
              <GameButton type="submit" variant="primary" className="w-full justify-center py-4" disabled={isCreating}>
                {isCreating ? <Loader2 className="animate-spin" /> : 'SİSTEME KAYDET'}
              </GameButton>
            </form>
          </div>
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 relative overflow-hidden max-h-[95vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyber-red" />
            <div className="sticky top-0 bg-zinc-950 z-10 p-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <div><h2 className="text-xl font-black text-white uppercase tracking-tight">ETKİNLİK DÜZENLE</h2><p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">ID: {editingEvent.id}</p></div>
              <button onClick={() => setEditingEvent(null)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Başlık</label><input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className={inputCls} /></div>
                <div><label className={labelCls}>Tarih</label><input type="text" value={editForm.eventDate} onChange={e => setEditForm({...editForm, eventDate: e.target.value})} className={inputCls} /></div>
                <div><label className={labelCls}>Konum İsmi</label><input type="text" value={editForm.eventLocation} onChange={e => setEditForm({...editForm, eventLocation: e.target.value})} className={inputCls} required /></div>
                <div><label className={labelCls}>Google Maps Linki</label><input type="url" value={editForm.eventLocationUrl} onChange={e => setEditForm({...editForm, eventLocationUrl: e.target.value})} className={inputCls} required /></div>
                <div><label className={labelCls}>Enlem (Latitude)</label><input type="text" value={editForm.latitude} onChange={e => setEditForm({...editForm, latitude: e.target.value})} className={inputCls} placeholder="39.8724° N" /></div>
                <div><label className={labelCls}>Boylam (Longitude)</label><input type="text" value={editForm.longitude} onChange={e => setEditForm({...editForm, longitude: e.target.value})} className={inputCls} placeholder="32.7317° E" /></div>
              </div>
              <div><label className={labelCls}>Açıklama</label><textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className={`${inputCls} resize-none`} rows={3} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button type="button" onClick={() => setEditForm({...editForm, isActive: !editForm.isActive})} className={`flex items-center justify-between p-4 border rounded transition-all ${editForm.isActive ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 bg-black/20'}`}>
                  <div className="text-left"><span className="block text-xs font-black uppercase text-white">Yayın Durumu</span><span className={`text-[9px] font-mono ${editForm.isActive ? 'text-green-400' : 'text-gray-500'}`}>{editForm.isActive ? 'AKTİF' : 'GİZLİ'}</span></div>
                  {editForm.isActive ? <ToggleRight className="text-green-500" size={24} /> : <ToggleLeft className="text-gray-500" size={24} />}
                </button>
                <button type="button" onClick={() => setEditForm({...editForm, applicationsOpen: !editForm.applicationsOpen})} className={`flex items-center justify-between p-4 border rounded transition-all ${editForm.applicationsOpen ? 'border-cyber-red/30 bg-cyber-red/5' : 'border-white/5 bg-black/20'}`}>
                  <div className="text-left"><span className="block text-xs font-black uppercase text-white">Başvurular</span><span className={`text-[9px] font-mono ${editForm.applicationsOpen ? 'text-cyber-red' : 'text-gray-500'}`}>{editForm.applicationsOpen ? 'AÇIK' : 'KAPALI'}</span></div>
                  {editForm.applicationsOpen ? <ToggleRight className="text-cyber-red" size={24} /> : <ToggleLeft className="text-gray-500" size={24} />}
                </button>
                <button type="button" onClick={() => setEditForm({...editForm, lobbyOpen: !editForm.lobbyOpen})} className={`flex items-center justify-between p-4 border rounded transition-all ${editForm.lobbyOpen ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/5 bg-black/20'}`}>
                  <div className="text-left"><span className="block text-xs font-black uppercase text-white">Takım Lobisi</span><span className={`text-[9px] font-mono ${editForm.lobbyOpen ? 'text-blue-400' : 'text-gray-500'}`}>{editForm.lobbyOpen ? 'AÇIK' : 'KAPALI'}</span></div>
                  {editForm.lobbyOpen ? <ToggleRight className="text-blue-500" size={24} /> : <ToggleLeft className="text-gray-500" size={24} />}
                </button>
              </div>
            </div>
            <div className="sticky bottom-0 bg-zinc-950 border-t border-white/5 p-4 flex items-center justify-between">
              <button onClick={() => setEditingEvent(null)} className="text-sm font-bold text-gray-500">İPTAL</button>
              <GameButton onClick={saveEventChanges} variant="primary" className="py-3 px-8" disabled={isSaving}>{isSaving ? <Loader2 className="animate-spin" /> : 'KAYDET'}</GameButton>
            </div>
          </div>
        </div>
      )}

      {/* ========== SIDEBAR ========== */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <img src={hujamLogo} alt="HUJAM" className="h-8 w-auto filter brightness-0 invert" />
          <span className="font-black text-white tracking-widest text-xs">ADMIN_PANEL</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {([
            {id: 'events', icon: LayoutDashboard, label: 'Etkinlikler'},
            {id: 'applications', icon: Users, label: 'Başvurular'},
            {id: 'lobby', icon: Users, label: 'Lobi'},
            {id: 'sponsors', icon: ShieldCheck, label: 'Organizasyon'},
            {id: 'faqs', icon: HelpCircle, label: 'S.S.S.'},
            {id: 'messages', icon: ArrowUpRight, label: 'Mesajlar'}
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-cyber-red/10 text-cyber-red border-l-2 border-cyber-red' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 text-center">
           <button onClick={handleLogout} className="text-[10px] font-black text-zinc-700 hover:text-white uppercase tracking-widest py-2">SİSTEMDEN ÇIK</button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40 p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-widest">
              {activeTab === 'events' ? 'Panel Merkezi' : 
               activeTab === 'applications' ? 'Katılım Listesi' : 
               activeTab === 'lobby' ? 'Lobi İlan Merkezi' :
               activeTab === 'sponsors' ? 'Organizasyon Yönetimi' :
               activeTab === 'faqs' ? 'Sıkça Sorulan Sorular' : 'Mesajlar'}
            </h1>
            {activeTab !== 'events' && (
              <select value={selectedEventId || ''} onChange={e => setSelectedEventId(e.target.value)} className="bg-transparent border-none text-[10px] text-cyber-red font-mono font-bold uppercase tracking-widest outline-none cursor-pointer">
                {events.map(e => <option key={e.id} value={e.id} className="bg-zinc-900">{e.title}</option>)}
              </select>
            )}
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'events' && <GameButton onClick={() => setIsModalOpen(true)} variant="primary" className="py-2 text-xs">YENİ ETKİNLİK</GameButton>}
            {activeTab === 'applications' && (
              <div className="relative">
                <button onClick={() => setXlsxDropdownOpen(!xlsxDropdownOpen)} className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all">
                  <Download size={14} /> XLSX İNDİR <ChevronDown size={12} />
                </button>
                {xlsxDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-white/10 shadow-2xl z-50 min-w-[220px]">
                    <button onClick={() => exportApplicationsToXlsx('detailed')} className="w-full text-left px-4 py-3 text-[10px] font-bold text-zinc-300 hover:bg-white/5 hover:text-green-400 transition-all flex items-center gap-2 border-b border-white/5"><FileText size={13} /> Detaylı Başvuru Listesi</button>
                    <button onClick={() => exportApplicationsToXlsx('roster')} className="w-full text-left px-4 py-3 text-[10px] font-bold text-zinc-300 hover:bg-white/5 hover:text-green-400 transition-all flex items-center gap-2 border-b border-white/5"><Users size={13} /> Hızlı Takım Listesi</button>
                    <button onClick={() => exportApplicationsToXlsx('combined')} className="w-full text-left px-4 py-3 text-[10px] font-bold text-zinc-300 hover:bg-white/5 hover:text-green-400 transition-all flex items-center gap-2"><Download size={13} /> Hepsini İndir (2 Sayfa)</button>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'lobby' && (
              <button onClick={exportLobbyToXlsx} className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all">
                <Download size={14} /> XLSX İNDİR
              </button>
            )}
            {activeTab !== 'events' && (
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input type="text" placeholder="VERİ ARA..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black border border-white/10 pl-10 pr-4 py-2 text-xs text-white focus:border-cyber-red outline-none transition-all" />
              </div>
            )}
          </div>
        </header>

        <div className="p-6 flex-1">
          {/* TAB: EVENTS */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className={`bg-zinc-900/30 border transition-all p-6 relative group overflow-hidden cursor-pointer ${selectedEventId === event.id ? 'border-cyber-red shadow-[0_0_20px_rgba(255,0,0,0.1)]' : 'border-white/5 hover:border-white/20'}`}
                  onClick={() => {
                    setSelectedEventId(event.id);
                    // Don't switch tab automatically, but highlight the selection
                  }}
                >
                  {event.isActive && <div className="absolute top-0 right-0 p-2"><div className="bg-cyber-red text-black text-[9px] font-black px-2 py-0.5 tracking-tighter shadow-glow-red">AKTİF</div></div>}
                  <h3 className="text-white font-black text-lg mb-1 group-hover:text-cyber-red transition-colors">{event.title}</h3>
                  <code className="text-[10px] text-zinc-600 block mb-4 font-mono">{event.id}</code>
                  
                  <div className="space-y-2 text-[11px] mb-6 text-zinc-500">
                    <p className="flex items-center gap-2"><CalendarDays size={12} className="text-cyber-red" /> {event.eventDate || 'Belirsiz'}</p>
                    <p className="flex items-center gap-2 truncate"><MapPin size={12} className="text-cyber-red" /> {event.eventLocation || 'Belirsiz'}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEventEditor(event); }} 
                      className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest"
                    >
                      AYARLAR
                    </button>
                    <div className="flex gap-4">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setSelectedEventId(event.id); 
                          setActiveTab('sponsors'); 
                        }} 
                        className="text-[10px] font-black text-cyber-red hover:text-white uppercase tracking-widest flex items-center gap-1"
                      >
                        YÖNET <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyber-red/5 -rotate-45" />
                </div>
              ))}
            </div>
          )}

          {/* TAB: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-8">
              {/* ===== STATS BAR ===== */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'TOPLAM BAŞVURU', value: appItems.length, color: 'text-white', bg: 'border-white/10' },
                  { label: 'ONAYLANAN', value: appItems.filter((a: any) => a.status === 'Approved').length, color: 'text-green-400', bg: 'border-green-500/30 bg-green-500/5' },
                  { label: 'REDDEDİLEN', value: appItems.filter((a: any) => a.status === 'Rejected').length, color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/5' },
                  { label: 'BEKLEYEN', value: appItems.filter((a: any) => !a.status || a.status === 'Pending').length, color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/5' },
                  { label: 'TOPLAM KİŞİ (ONAYLI)', value: appItems.filter((a: any) => a.status === 'Approved').reduce((s: number, a: any) => s + (parseInt(a.teamCount) || 1), 0), color: 'text-cyan-400', bg: 'border-cyan-500/30 bg-cyan-500/5' },
                ].map((stat, i) => (
                  <div key={i} className={`border p-4 ${stat.bg}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">{stat.label}</span>
                    <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* ===== HEADER ===== */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-cyber-red animate-pulse" />
                   <h2 className="text-lg font-black text-white uppercase tracking-wider">{currentEventData?.title} / BAŞVURU LİSTESİ</h2>
                </div>
              </div>

              {/* ===== APPLICATION CARDS ===== */}
              <div className="grid gap-4">
              {filteredApps.map((item, appIdx) => (
                <div key={item.id} className={`bg-zinc-900/40 border p-6 transition-all ${item.status === 'Approved' ? 'border-green-500/20 border-l-2 border-l-green-500' : item.status === 'Rejected' ? 'border-red-500/20 border-l-2 border-l-red-500 opacity-50' : 'border-white/5 hover:border-cyber-red/20'}`}>
                  <div className="flex flex-col xl:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyber-red/10 flex items-center justify-center border border-cyber-red/20 text-cyber-red font-black text-lg">{appIdx + 1}</div>
                        <div className="flex-1">
                          <h3 className="text-white font-black text-lg uppercase tracking-tight">{item.teamName || 'BİREYSEL'} <span className="text-zinc-600 text-[10px] ml-2">({item.teamCount} KİŞİ)</span></h3>
                          <p className="text-gray-400 text-xs font-mono uppercase">KAPTAN: {item.captain?.name} // {item.captain?.email}</p>
                        </div>
                        {/* Info Button */}
                        <button
                          onClick={() => setExpandedAppId(expandedAppId === item.id ? null : item.id)}
                          className={`p-2 border transition-all ${expandedAppId === item.id ? 'border-cyber-red text-cyber-red bg-cyber-red/10' : 'border-white/10 text-zinc-500 hover:text-white hover:border-white/30'}`}
                          title="Detayları göster"
                        >
                          <Info size={18} />
                        </button>
                      </div>

                      {/* Tracking Controls - Always visible */}
                      <div className="flex flex-wrap gap-3 items-center">
                        <button
                          onClick={() => updateTracking(item.id, 'confirmed', !item.confirmed)}
                          className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${item.confirmed ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-white/10 text-zinc-600 hover:border-white/20'}`}
                        >
                          <CheckCircle size={13} /> TEYİT {item.confirmed ? '✓' : ''}
                        </button>
                        <button
                          onClick={() => updateTracking(item.id, 'called', !item.called)}
                          className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${item.called ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : 'border-white/10 text-zinc-600 hover:border-white/20'}`}
                        >
                          <PhoneCall size={13} /> ARANDI {item.called ? '✓' : ''}
                        </button>
                        {/* Note indicator / toggle */}
                        <button
                          onClick={() => { setEditingNoteId(editingNoteId === item.id ? null : item.id); setTempNote(item.adminNote || ''); }}
                          className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${item.adminNote ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' : 'border-white/10 text-zinc-600 hover:border-white/20'}`}
                        >
                          <StickyNote size={13} /> NOT {item.adminNote ? '✓' : ''}
                        </button>
                      </div>

                      {/* Note Editor */}
                      {editingNoteId === item.id && (
                        <div className="flex gap-2 items-end">
                          <textarea
                            value={tempNote}
                            onChange={e => setTempNote(e.target.value)}
                            placeholder="Admin notu ekleyin..."
                            className="flex-1 bg-black/60 border border-white/10 p-3 text-white text-xs focus:border-cyber-red outline-none transition-all resize-none font-sans"
                            rows={2}
                          />
                          <button onClick={() => saveNote(item.id)} className="px-4 py-2 bg-cyber-red text-black text-[10px] font-black uppercase hover:bg-white transition-all h-fit">KAYDET</button>
                        </div>
                      )}
                      {/* Saved note display */}
                      {item.adminNote && editingNoteId !== item.id && (
                        <div className="bg-yellow-500/5 border-l-2 border-yellow-500/30 px-3 py-2 text-[11px] text-yellow-300/80 italic">
                          📝 {item.adminNote}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border transition-all ${item.status === 'Approved' ? 'border-green-500/50 text-green-500 bg-green-500/5' : item.status === 'Rejected' ? 'border-red-500/50 text-red-500 bg-red-500/5' : 'border-zinc-800 text-zinc-600 bg-black'}`}>{item.status === 'Approved' ? 'ONAYLANDI' : item.status === 'Rejected' ? 'REDDEDİLDİ' : 'BEKLIYOR'}</span>
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(item.id, 'Approved')} className="p-2 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-black transition-all" title="Onayla"><CheckCircle size={18} /></button>
                        <button onClick={() => updateStatus(item.id, 'Rejected')} className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black transition-all" title="Reddet"><XCircle size={18} /></button>
                        <button onClick={() => deleteItem(item.id)} className="p-2 border border-zinc-800 text-zinc-600 hover:text-white transition-all" title="Sil"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details Panel */}
                  {expandedAppId === item.id && (
                    <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-[12px] text-zinc-400">
                        <div className="space-y-1">
                          <span className={labelCls}>KAPTAN BİLGİSİ</span>
                          <div className="flex items-center gap-2">
                             {universities.find(u => u.UniversityName === item.captain?.university)?.University_logourl && (
                               <img src={universities.find(u => u.UniversityName === item.captain?.university)?.University_logourl} alt="" className="w-4 h-4 object-contain" />
                             )}
                             <p>{item.captain?.university} - {item.captain?.department} ({item.captain?.grade})</p>
                          </div>
                          <p className="text-cyber-red font-mono">{item.captain?.phone}</p>
                          <p className="text-zinc-500 font-mono text-[10px]">{item.captain?.email}</p>
                        </div>
                        {item.members && item.members.length > 0 && (
                          <div className="space-y-1">
                            <span className={labelCls}>EKİP ÜYELERİ</span>
                            {item.members.map((m: any, idx: number) => (
                              <p key={idx} className="text-[10px] text-zinc-500">• {m.name} — {m.university} — {m.email} — {m.phone}</p>
                            ))}
                          </div>
                        )}
                        <div className="space-y-1">
                          <span className={labelCls}>SUNUCU TALEBİ</span>
                          <p className={item.serverRequest?.requested === 'yes' ? 'text-blue-400' : ''}>
                            {item.serverRequest?.requested === 'yes' ? `EVET: ${item.serverRequest.details}` : 'HAYIR'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className={labelCls}>ÖNCEKİ KATILIM</span>
                          <p>{item.previousParticipation === 'no' ? 'İlk kez' : item.previousParticipation === 'yes_hujam' ? 'HUJAM deneyimi var' : 'Başka jam deneyimi var'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className={labelCls}>TECRÜBE</span>
                          <p className="italic text-[10px]">{item.experience || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className={labelCls}>SAĞLIK DURUMU</span>
                          <p className="text-[10px]">{item.healthCondition || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className={labelCls}>ACİL İLETİŞİM</span>
                          <p className="text-cyber-red font-mono">{item.emergencyPhone || '—'}</p>
                        </div>
                        {item.answers && Object.entries(item.answers).map(([qId, ans]: [string, any]) => (
                          <div key={qId} className="space-y-1">
                            <span className={labelCls}>ÖZEL SORU: {qId}</span>
                            <p className="italic">"{ans}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              </div>

              {/* ===== QUICK ROSTER TABLE ===== */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="text-cyan-400" size={18} />
                  <h2 className="text-sm font-black text-white tracking-widest">Hızlı Katılımcı Tablosu (Onaylananlar)</h2>
                  <span className="text-[9px] text-zinc-600 font-mono bg-zinc-900 px-2 py-0.5 border border-white/5">Sadece onaylı takımlar</span>
                </div>
                <div className="bg-zinc-950/40 border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/60 border-b border-white/10">
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">#</th>
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">TAKIM</th>
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">KAPTAN</th>
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">ÜNİVERSİTE</th>
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">KİŞİ</th>
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">TEYİT</th>
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">ARANDI</th>
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">NOT</th>
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">DURUM</th>
                          <th className="p-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">İŞLEM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {appItems.filter((item: any) => item.status === 'Approved').map((item: any, idx: number) => (
                          <tr key={item.id} className={`hover:bg-white/[0.03] transition-all ${item.status === 'Rejected' ? 'opacity-40' : ''}`}>
                            <td className="p-3 text-zinc-600 font-black text-xs text-center">{idx + 1}</td>
                            <td className="p-3 text-white font-bold text-xs uppercase">{item.teamName || '—'}</td>
                            <td className="p-3 text-zinc-400 text-[11px]">{item.captain?.name}</td>
                            <td className="p-3 text-zinc-500 text-[10px] max-w-[140px] truncate">{item.captain?.university}</td>
                            <td className="p-3 text-white font-black text-sm text-center">{item.teamCount || 1}</td>
                            <td className="p-3 text-center">
                              <button onClick={() => updateTracking(item.id, 'confirmed', !item.confirmed)} className={`text-[10px] px-2 py-0.5 border transition-all ${item.confirmed ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-zinc-700 border-white/5'}`}>
                                {item.confirmed ? '✓' : '—'}
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <button onClick={() => updateTracking(item.id, 'called', !item.called)} className={`text-[10px] px-2 py-0.5 border transition-all ${item.called ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 'text-zinc-700 border-white/5'}`}>
                                {item.called ? '✓' : '—'}
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              {item.adminNote ? <span className="text-yellow-400 text-[10px]" title={item.adminNote}>📝</span> : <span className="text-zinc-700">—</span>}
                            </td>
                            <td className="p-3 text-center">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 border ${item.status === 'Approved' ? 'text-green-400 border-green-500/30 bg-green-500/10' : item.status === 'Rejected' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'}`}>
                                {item.status === 'Approved' ? 'ONAY' : item.status === 'Rejected' ? 'RET' : 'BEKLE'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1">
                                <button onClick={() => updateStatus(item.id, 'Approved')} className="p-1.5 text-green-500/50 hover:text-green-400 hover:bg-green-500/10 transition-all rounded" title="Onayla"><CheckCircle size={15} /></button>
                                <button onClick={() => updateStatus(item.id, 'Rejected')} className="p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-all rounded" title="Reddet"><XCircle size={15} /></button>
                                <button onClick={() => deleteItem(item.id)} className="p-1.5 text-zinc-700 hover:text-white hover:bg-white/10 transition-all rounded" title="Sil"><Trash2 size={15} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FAQ MANAGEMENT */}
          {activeTab === 'faqs' && currentEventData && (
            <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
               <div className="flex items-center gap-3 mb-2"><HelpCircle className="text-cyber-red" /> <h2 className="text-lg font-black text-white uppercase tracking-wider">SSS YÖNETİMİ</h2></div>
               <div className="bg-zinc-900/30 border border-white/5 p-6 space-y-4">
                 {currentEventData.faqs?.map((f: any, i: number) => (
                   <div key={i} className="bg-black/40 border-l border-white/10 p-4 transition-all hover:border-l-cyber-red group">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-white font-bold text-sm tracking-tight">{f.question}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveArrayItem('faqs', i, 'up')} disabled={i === 0} className="text-zinc-600 hover:text-white disabled:opacity-30 p-1"><ArrowUpRight className="-rotate-45" size={14} /></button>
                          <button onClick={() => moveArrayItem('faqs', i, 'down')} disabled={i === (currentEventData.faqs.length - 1)} className="text-zinc-600 hover:text-white disabled:opacity-30 p-1"><ArrowUpRight className="rotate-135" size={14} /></button>
                          <button onClick={() => removeFaq(i)} className="text-zinc-600 hover:text-red-500 ml-1 p-1"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p className="text-zinc-500 text-xs italic">"{f.answer}"</p>
                   </div>
                 ))}
                 <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
                   <div>
                     <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">SORU</label>
                     <input type="text" placeholder="SSS başlığı..." value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} className={inputCls} />
                   </div>
                   <div>
                     <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">CEVAP</label>
                     <textarea placeholder="Jammerlara yönelik cevap..." value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} className={`${inputCls} resize-none`} rows={3} />
                   </div>
                   <button onClick={addFaq} className="bg-cyber-red text-black font-black text-xs uppercase tracking-widest px-8 py-3 hover:bg-white transition-all">SSS EKLE</button>
                 </div>
               </div>
            </div>
          )}

          {/* TAB: DYNAMIC FORM MANAGEMENT */}
          {activeTab === 'forms' && currentEventData && (
            <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
               <div className="flex items-center gap-3 mb-2"><ListTodo className="text-cyber-red" /> <h2 className="text-lg font-black text-white uppercase tracking-wider">KATILIM FORMU SORULARI</h2></div>
               <div className="bg-zinc-900/30 border border-white/5 p-6 space-y-4">
                  {currentEventData.customQuestions?.map((q: any, i: number) => (
                    <div key={q.id} className="bg-black/40 border border-white/5 p-4 flex justify-between items-center group">
                       <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-1 items-center">
                             <button onClick={() => moveArrayItem('customQuestions', i, 'up')} disabled={i === 0} className="text-zinc-700 hover:text-white disabled:opacity-20"><ArrowUpRight className="-rotate-45" size={12} /></button>
                             <button onClick={() => moveArrayItem('customQuestions', i, 'down')} disabled={i === currentEventData.customQuestions.length - 1} className="text-zinc-700 hover:text-white disabled:opacity-20"><ArrowUpRight className="rotate-135" size={12} /></button>
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm uppercase">{q.label} <span className="text-[9px] text-zinc-600 ml-2">[{q.type.toUpperCase()}]</span></p>
                            <p className="text-zinc-500 text-[10px] font-mono">{q.placeholder || '---'}</p>
                          </div>
                       </div>
                       <div className="flex gap-2 opacity-10 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => editCustomQuestion(q)} className="text-zinc-600 hover:text-blue-400 p-1"><Pencil size={16} /></button>
                          <button onClick={() => removeCustomQuestion(q.id)} className="text-zinc-600 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                       </div>
                    </div>
                  ))}
                  
                  <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">// YENI_SORU_MODELI</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-600 font-bold uppercase mb-1 block">SORU ETİKETİ</label>
                        <input type="text" placeholder="örn: Portfolyo Linki" value={newQuestion.label} onChange={e => setNewQuestion({...newQuestion, label: e.target.value})} className={inputCls} />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-600 font-bold uppercase mb-1 block">İPUCU (PLACEHOLDER)</label>
                        <input type="text" placeholder="örn: https://github.com/..." value={newQuestion.placeholder} onChange={e => setNewQuestion({...newQuestion, placeholder: e.target.value})} className={inputCls} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-zinc-600 font-bold uppercase mb-1 block">SORU TİPİ</label>
                        <select value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value as any})} className={inputCls}>
                           <option value="text">Kısa Metin</option>
                           <option value="textarea">Uzun Metin (Textarea)</option>
                           <option value="select">Seçenekli (Dropdown)</option>
                        </select>
                      </div>
                      <div className="flex items-center h-full pt-5">
                        <label className="flex items-center gap-3 p-3 bg-black border border-white/5 cursor-pointer w-full">
                           <input type="checkbox" checked={newQuestion.required} onChange={e => setNewQuestion({...newQuestion, required: e.target.checked})} className="accent-cyber-red" />
                           <span className="text-[11px] font-bold text-zinc-500">BU ALAN DOLDURULMAK ZORUNDA</span>
                        </label>
                      </div>
                    </div>
                    {newQuestion.type === 'select' && (
                      <div>
                        <label className="text-[10px] text-zinc-600 font-bold uppercase mb-1 block">SEÇENEKLER (VİRGÜLLE AYIRIN)</label>
                        <input type="text" placeholder="Unity, Unreal, Godot..." value={newQuestion.options} onChange={e => setNewQuestion({...newQuestion, options: e.target.value})} className={inputCls} />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-4 pt-2">
                       <button onClick={addCustomQuestion} className="bg-cyber-red text-black font-black text-xs uppercase tracking-widest px-8 py-3 hover:bg-white transition-all flex items-center gap-2">
                         {editingQuestionId ? <Save size={16} /> : <Plus size={16} />} 
                         {editingQuestionId ? 'SORUYU GÜNCELLE' : 'YENİ SORU EKLE'}
                       </button>
                       {editingQuestionId && (
                         <button onClick={() => { setEditingQuestionId(null); setNewQuestion({ label: '', placeholder: '', type: 'text', required: true, options: '' }); }} className="text-[10px] font-bold text-zinc-500 uppercase hover:text-white transition-colors">DÜZENLEMEYİ İPTAL ET</button>
                       )}
                    </div>
                  </div>
               </div>
            </div>
          )}
           {/* TAB: SPONSORS & ORGANIZERS */}
          {activeTab === 'sponsors' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
              
              {/* Sponsors Management */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="text-cyber-red" />
                  <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">ETKİNLİK SPONSORLARI</h2>
                </div>
                
                <div className="bg-zinc-900/40 border border-white/5 p-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input type="text" placeholder="SPONSOR ADI..." value={newSponsor.name} onChange={e => setNewSponsor({...newSponsor, name: e.target.value})} className={inputCls} />
                      <input type="url" placeholder="LOGO URL (OPSİYONEL)..." value={newSponsor.logoUrl} onChange={e => setNewSponsor({...newSponsor, logoUrl: e.target.value})} className={inputCls} />
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={newSponsor.tier.startsWith('custom:') ? 'other' : newSponsor.tier} 
                        onChange={e => {
                          const val = e.target.value;
                          setNewSponsor({...newSponsor, tier: val === 'other' ? 'custom:' : val});
                        }} 
                        className={`${inputCls} flex-1`}
                      >
                        <option value="main">Ana Sponsor</option>
                        <option value="platinum">Platin Sponsor</option>
                        <option value="gold">Altın Sponsor</option>
                        <option value="clothing">Giyim Sponsoru</option>
                        <option value="server">Sunucu Sponsoru</option>
                        <option value="education">Eğitim Sponsoru</option>
                        <option value="audio">Ses Sponsoru</option>
                        <option value="other">Özel Kategori...</option>
                      </select>
                      {newSponsor.tier.startsWith('custom:') && (
                        <input 
                          type="text" 
                          placeholder="KATEGORİ ADI (örn: Medya)" 
                          value={newSponsor.tier.replace('custom:', '')} 
                          onChange={e => setNewSponsor({...newSponsor, tier: 'custom:' + e.target.value})} 
                          className={`${inputCls} flex-1`}
                        />
                      )}
                      <button onClick={addSponsor} className="bg-cyber-red text-black font-black text-[10px] uppercase tracking-widest px-6 hover:bg-white transition-all">EKLE</button>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    {currentEventData?.sponsors?.map((s: any, i: number) => (
                      <div 
                        key={s.id} 
                        draggable
                        onDragStart={(e) => { setDraggedSponsorIdx(i); e.dataTransfer.effectAllowed = "move"; setTimeout(() => (e.target as HTMLElement).style.opacity = '0.5', 0); }}
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                        onDrop={(e) => handleDropSponsor(e, i)}
                        onDragEnd={(e) => { (e.target as HTMLElement).style.opacity = '1'; setDraggedSponsorIdx(null); }}
                        className={`bg-black/40 border border-white/5 p-3 flex justify-between items-center group cursor-move transition-all ${draggedSponsorIdx === i ? 'opacity-50 ring-2 ring-cyber-red/50' : 'hover:bg-white/5 hover:border-white/20'}`}
                        title="Sürükleyip Bırakın"
                      >
                        <div className="flex items-center gap-3">
                           <div className="flex flex-col gap-1 items-center opacity-20 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => moveArrayItem('sponsors', i, 'up')} disabled={i === 0} className="text-zinc-700 hover:text-white disabled:opacity-20"><ArrowUpRight className="-rotate-45" size={12} /></button>
                             <button onClick={() => moveArrayItem('sponsors', i, 'down')} disabled={i === currentEventData.sponsors.length - 1} className="text-zinc-700 hover:text-white disabled:opacity-20"><ArrowUpRight className="rotate-135" size={12} /></button>
                           </div>
                           <div>
                             <p className="text-white font-bold text-xs uppercase">{s.name}</p>
                             <p className="text-cyber-red text-[8px] font-black uppercase tracking-tighter mt-0.5">{s.tier}</p>
                           </div>
                        </div>
                        <button onClick={() => removeSponsor(s.id)} className="text-zinc-700 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    {(!currentEventData?.sponsors || currentEventData.sponsors.length === 0) && <p className="text-[10px] text-zinc-700 italic text-center py-4">Henüz sponsor eklenmemiş...</p>}
                  </div>
                </div>
              </div>

              {/* Organizers Management */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-cyber-red" />
                  <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">ETKİNLİK SORUMLULARI</h2>
                </div>
                
                <div className="bg-zinc-900/40 border border-white/5 p-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    <input type="text" placeholder="SORUMLU ADI..." value={newOrganizer.name} onChange={e => setNewOrganizer({...newOrganizer, name: e.target.value})} className={inputCls} />
                    <div className="flex gap-2">
                      <input type="text" placeholder="GÖREV/ROL..." value={newOrganizer.role} onChange={e => setNewOrganizer({...newOrganizer, role: e.target.value})} className={`${inputCls} flex-1`} />
                      <button onClick={addOrganizer} className="bg-cyber-red text-black font-black text-[10px] uppercase tracking-widest px-6 hover:bg-white transition-all">EKLE</button>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    {currentEventData?.organizers?.map((o: any, i: number) => (
                      <div key={o.id} className="bg-black/40 border border-white/5 p-3 flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                           <div className="flex flex-col gap-1 items-center">
                             <button onClick={() => moveArrayItem('organizers', i, 'up')} disabled={i === 0} className="text-zinc-700 hover:text-white disabled:opacity-20"><ArrowUpRight className="-rotate-45" size={12} /></button>
                             <button onClick={() => moveArrayItem('organizers', i, 'down')} disabled={i === currentEventData.organizers.length - 1} className="text-zinc-700 hover:text-white disabled:opacity-20"><ArrowUpRight className="rotate-135" size={12} /></button>
                           </div>
                           <div>
                             <p className="text-white font-bold text-xs uppercase">{o.name}</p>
                             <p className="text-zinc-500 text-[8px] font-mono mt-0.5">{o.role || 'GÖREV BELİRTİLMEDİ'}</p>
                           </div>
                        </div>
                        <button onClick={() => removeOrganizer(o.id)} className="text-zinc-700 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    {(!currentEventData?.organizers || currentEventData.organizers.length === 0) && <p className="text-[10px] text-zinc-700 italic text-center py-4">Henüz sorumlu eklenmemiş...</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* TAB: LOBBY */}
          {activeTab === 'lobby' && (
            <div className="space-y-6">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-2 h-2 bg-cyber-red animate-pulse" />
                  <h2 className="text-lg font-black text-white uppercase tracking-wider flex flex-wrap items-center gap-4">
                    {currentEventData?.title || 'ETKİNLİK'} / LOBİ İLANLARI
                    <span className="bg-zinc-800 text-zinc-500 text-[9px] px-2 py-0.5 border border-white/5 font-mono">
                      DEBUG_ID: {selectedEventId}
                    </span>
                    <span className="bg-cyber-red/20 text-cyber-red text-[10px] px-2 py-0.5 border border-cyber-red/30 font-mono">
                      TOTAL_LOGS: {lobbyItems.length}
                    </span>
                  </h2>
               </div>

               <div className="bg-zinc-950/40 border border-white/5 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border-separate border-spacing-0">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/60 sticky top-0 z-10">
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-white/10">KULLANICI</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-white/10">STATÜ VE ROL</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-white/10">YETENEKLER</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-white/10">MESAJ İÇERİĞİ</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-white/10">İLETİŞİM</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-white/10">SİSTEM VERİSİ</th>
                        <th className="p-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-white/10 text-right">İŞLEMLER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {filteredLobby.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-20 text-center text-zinc-600 font-black uppercase tracking-widest text-xs opacity-50">LOBİDE HENÜZ AKTİF İLAN BULUNMUYOR</td>
                        </tr>
                      )}
                      {filteredLobby.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.03] transition-all group">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <span className="text-white font-black text-sm uppercase tracking-tight group-hover:text-cyber-red transition-colors">{item.userName}</span>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-cyber-red font-black uppercase tracking-widest bg-cyber-red/10 px-2.5 py-1 border border-cyber-red/20 w-fit">{item.role}</span>
                              <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 border w-fit ${item.intent === 'looking-for-team' ? 'text-blue-400 border-blue-400/20 bg-blue-400/10' : 'text-green-400 border-green-400/20 bg-green-400/10'}`}>
                                {item.intent === 'looking-for-team' ? 'TAKIM ARIYOR' : 'ÜYE ARIYOR'}
                              </span>
                            </div>
                          </td>
                          <td className="p-5 max-w-[200px]">
                            <span className="text-zinc-300 text-[10px] font-medium leading-relaxed block truncate group-hover:whitespace-normal" title={item.skills}>{item.skills}</span>
                          </td>
                          <td className="p-5 max-w-[350px]">
                            <div className="bg-black/20 p-3 border border-white/5 rounded-sm group-hover:bg-black/40 transition-all">
                              <p className="text-zinc-400 text-[11px] leading-relaxed italic font-sans break-words overflow-hidden line-clamp-2 group-hover:line-clamp-none">
                                "{item.description}"
                              </p>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-white text-[11px] font-black uppercase tracking-tight">{item.contact}</span>
                              <span className="text-zinc-600 text-[8px] font-mono tracking-tighter">{item.contact.includes('@') ? 'PROTOKOL: E-POSTA' : 'PROTOKOL: DISCORD_ID'}</span>
                            </div>
                          </td>
                          <td className="p-5">
                             <div className="flex flex-col gap-2 font-mono">
                               <span className="text-zinc-500 text-[9px] font-bold border-l border-cyber-red pl-2">{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString('tr-TR') : 'YENİ_KAYIT'}</span>
                               <div className="flex flex-wrap gap-1.5">
                                 <span className="text-[8px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 border border-white/5 rounded-sm">{item.ipv4 || '---'}</span>
                                 <span className="text-[8px] px-1.5 py-0.5 bg-zinc-900 text-cyber-red border border-cyber-red/20 rounded-sm">{getOS(item.userAgent)}</span>
                               </div>
                             </div>
                           </td>
                          <td className="p-5 text-right">
                            <button 
                              onClick={() => deleteItem(item.id)} 
                              className="p-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all rounded"
                              title="Kaydı Sil"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
           )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="grid gap-4 max-w-4xl">
              {filteredMessages.map((item) => (
                <div key={item.id} className="bg-zinc-900/40 border border-white/5 p-6 border-l-cyber-red">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-black text-lg uppercase tracking-tight">{item.name} <span className="text-[10px] text-cyber-red ml-2 bg-cyber-red/5 px-2 py-0.5 border border-cyber-red/20">[{item.subject?.toUpperCase() || 'GENEL'}]</span></h3>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-[10px] text-zinc-500">{item.email}</code>
                        {item.phone && <span className="text-zinc-600 text-[9px] font-mono leading-none border-l border-white/10 pl-2">{item.phone}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono">{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString('tr-TR') : '---'}</span>
                      <div className="flex gap-2">
                         <span className="text-[8px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 border border-white/5 rounded-sm">{item.ipv4 || '---'}</span>
                         <span className="text-[8px] px-1.5 py-0.5 bg-zinc-900 text-cyber-red border border-cyber-red/20 rounded-sm">{getOS(item.userAgent)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/60 p-4 border border-white/5 text-sm text-zinc-400 font-sans tracking-wide leading-relaxed">{item.message}</div>
                  <div className="mt-4 flex justify-end gap-3">
                    <button onClick={() => deleteItem(item.id)} className="text-[10px] font-black text-zinc-700 hover:text-red-500 uppercase tracking-widest">SİL</button>
                    <a href={`mailto:${item.email}`} className="text-[10px] font-black text-cyber-red hover:underline uppercase tracking-widest">YANITLA_SISTEMI</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-950 border border-red-500/30 max-w-sm w-full shadow-[0_0_50px_rgba(255,0,0,0.1)]">
              <div className="bg-red-500/10 p-6 flex flex-col items-center text-center">
                <Trash2 className="text-red-500 mb-4" size={32} />
                <h3 className="text-white font-black text-lg uppercase tracking-widest mb-2">SİLME ONAYI</h3>
                <p className="text-zinc-400 text-sm mb-6">Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
                <div className="flex gap-4 w-full">
                  <button onClick={() => setDeleteConfirmId(null)} className="flex-1 bg-zinc-900 border border-white/10 text-white font-bold text-xs uppercase tracking-widest py-3 hover:bg-white/5 transition-all">İPTAL</button>
                  <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white font-black text-xs uppercase tracking-widest py-3 hover:bg-red-400 shadow-[0_0_20px_rgba(255,0,0,0.2)] transition-all">SİL</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
