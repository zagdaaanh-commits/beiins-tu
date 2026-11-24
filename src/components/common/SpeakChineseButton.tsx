import { Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../context/AppStoreContext';

interface SpeakChineseButtonProps {
  text: string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function SpeakChineseButton({
  text,
  label = 'Сонсох',
  size = 'sm',
  className = '',
}: SpeakChineseButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const { showToast } = useAppStore();

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast(`Дуудлагын жишээ: “${text}” (Таны хөтөч дуу хоолой үүсгэгчийг дэмжихгүй байна)`, 'info');
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeaking(false);
      showToast(`Дуудлагын жишээ: “${text}”`, 'info');
    }
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={`Хятад дуудлага сонсох: ${text}`}
      className={`inline-flex items-center gap-1.5 rounded-full border transition cursor-pointer ${
        speaking
          ? 'border-[#EB5E43] bg-[#EB5E43] text-white'
          : 'border-[#E5DDD0] bg-white text-[#25533E] hover:border-[#25533E] hover:bg-[#FAF4EA]'
      } ${size === 'sm' ? 'px-2.5 py-1 text-xs font-semibold' : 'px-3.5 py-1.5 text-sm font-semibold'} ${className}`}
    >
      <Volume2 className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      <span>{speaking ? 'Уншиж байна...' : label}</span>
    </button>
  );
}
