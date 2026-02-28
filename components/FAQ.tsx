import React, { useState } from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { FAQS } from '../constants';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSound } from './SoundManager';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

const FAQItemComponent: React.FC<{ item: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
  const { playClick } = useSound();

  const handleClick = () => {
    playClick();
    onClick();
  };

  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
        onClick={handleClick}
      >
        <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-cyber-red' : 'text-gray-300 group-hover:text-white'}`}>
          {item.question}
        </span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyber-red' : 'text-gray-500'}`}>
          <ChevronDown />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400 leading-relaxed pl-4 border-l-2 border-cyber-red/30">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const { playClick } = useSound();
  const { language } = useLanguage();
  const t = UI_TEXT[language].faq;
  const faqs = FAQS[language];

  return (
    <SectionFrame id="faq" title={t.title}>
      <div className="max-w-3xl mr-auto bg-zinc-900/50 border border-white/5 border-l-cyber-red/50 relative transition-all duration-300">
        
        {/* Toggle Header for the whole section */}
        <button 
            onClick={() => { playClick(); setIsSectionOpen(!isSectionOpen); }}
            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group focus:outline-none"
        >
            <span className="text-gray-400 font-mono text-sm uppercase tracking-widest group-hover:text-cyber-red transition-colors">
                {isSectionOpen ? t.hide : t.show}
            </span>
            <div className={`p-2 rounded-full border border-white/10 group-hover:border-cyber-red transition-all ${isSectionOpen ? 'bg-cyber-red text-white' : 'text-gray-400'}`}>
                {isSectionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
        </button>

        {/* Collapsible Content */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isSectionOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-6 pb-6 md:px-10 md:pb-10 pt-0">
                {faqs.map((faq, index) => (
                <FAQItemComponent 
                    key={index} 
                    item={faq} 
                    isOpen={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
                ))}
            </div>
        </div>
      </div>
    </SectionFrame>
  );
};