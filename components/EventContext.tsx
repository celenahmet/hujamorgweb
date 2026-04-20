import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

export interface ActiveEventData {
  id: string;
  title: string;
  isActive: boolean;
  applicationsOpen: boolean;
  lobbyOpen: boolean;
  eventDate: string;
  eventLocation: string;
  eventLocationUrl: string;
  latitude?: string;
  longitude?: string;
  description: string;
  faqs: { question: string; answer: string }[];
  customQuestions?: { id: string, label: string, placeholder: string, type: 'text' | 'textarea' | 'select', required: boolean, options?: string[] }[];
  formSteps?: { id: number, title: string, description?: string }[];
  sponsors?: { id: string, name: string, tier: string }[];
  organizers?: { id: string, name: string, role: string }[];
  createdAt: any;
}

interface EventContextType {
  activeEvent: ActiveEventData | null;
  allEvents: ActiveEventData[];
  loading: boolean;
  currentEventId: string | null;
  setCurrentEventId: (id: string | null) => void;
}

const EventContext = createContext<EventContextType>({
  activeEvent: null,
  allEvents: [],
  loading: true,
  currentEventId: null,
  setCurrentEventId: () => { }
});

export const useActiveEvent = () => useContext(EventContext);

const HUJAM25_STATIC: ActiveEventData = {
  id: 'hujam25',
  title: "HUJAM'25",
  isActive: false,
  applicationsOpen: false,
  lobbyOpen: false,
  eventDate: "31 Ekim - 2 Kasım 2025",
  eventLocation: "Hacettepe Üniversitesi Tunçalp Özgen Kongre ve Kültür Merkezi",
  eventLocationUrl: "https://maps.app.goo.gl/3fmxT5f4Z9QzM2X77",
  description: "Türkiye'nin en büyük öğrenci tabanlı oyun geliştirme maratonu.",
  faqs: [],
  createdAt: null
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allEvents, setAllEvents] = useState<ActiveEventData[]>([]);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allQuery = query(collection(db, 'events'));
    const unsubAll = onSnapshot(allQuery, (snapshot) => {
      const events = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          isActive: data.isActive || false,
          applicationsOpen: data.applicationsOpen || false,
          lobbyOpen: data.lobbyOpen || false,
          eventDate: data.eventDate || '',
          eventLocation: data.eventLocation || '',
          eventLocationUrl: data.eventLocationUrl || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          description: data.description || '',
          faqs: data.faqs || [],
          customQuestions: data.customQuestions || [],
          formSteps: data.formSteps || [],
          sponsors: data.sponsors || [],
          organizers: data.organizers || [],
          createdAt: data.createdAt
        };
      }) as ActiveEventData[];

      setAllEvents(events);
      setLoading(false);
    });

    return () => unsubAll();
  }, []);

  // Logical Selection
  let activeEvent = allEvents.find(e => e.id === currentEventId) || allEvents.find(e => e.isActive) || null;

  // Fallback Logic:
  if (!activeEvent) {
    activeEvent = HUJAM25_STATIC;
  }

  // Ensure HUJAM'25 is in the list for selection
  const normalizedEvents = allEvents.some(e => e.id === 'hujam25') 
    ? allEvents 
    : [HUJAM25_STATIC, ...allEvents];

  return (
    <EventContext.Provider value={{ activeEvent, allEvents: normalizedEvents, loading, currentEventId, setCurrentEventId }}>
      {children}
    </EventContext.Provider>
  );
};
