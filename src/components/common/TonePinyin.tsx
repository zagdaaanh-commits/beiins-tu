export function getPinyinTone(syllable: string): 0 | 1 | 2 | 3 | 4 {
  if (/[āēīōūǖĀĒĪŌŪǕ]/.test(syllable)) return 1;
  if (/[áéíóúǘÁÉÍÓÚǗ]/.test(syllable)) return 2;
  if (/[ǎěǐǒǔǚǍĚǏǑǓǙ]/.test(syllable)) return 3;
  if (/[àèìòùǜÀÈÌÒÙǛ]/.test(syllable)) return 4;
  return 0;
}

interface TonePinyinProps {
  text: string;
  colorize?: boolean;
  className?: string;
}

export function TonePinyin({ text, colorize = true, className = '' }: TonePinyinProps) {
  if (!colorize) {
    return <span className={`font-pinyin text-[#4B5563] ${className}`}>{text}</span>;
  }

  const tokens = text.split(/(\s+)/);
  return (
    <span className={`font-pinyin ${className}`}>
      {tokens.map((token, idx) => {
        if (/^\s+$/.test(token)) return <span key={idx}>{token}</span>;
        const tone = getPinyinTone(token);
        return (
          <span key={idx} className={`tone-${tone} font-semibold`}>
            {token}
          </span>
        );
      })}
    </span>
  );
}
