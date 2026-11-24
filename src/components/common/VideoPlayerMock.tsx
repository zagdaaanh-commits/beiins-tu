import {
  Captions,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { HanziLine } from '../../types';
import { SampleBadge } from './SampleBadge';
import { TonePinyin } from './TonePinyin';

interface VideoPlayerMockProps {
  title: string;
  chineseTitle: string;
  thumbnailUrl: string;
  videoUrl: string;
  durationLabel: string;
  durationSec: number;
  hanziLines: HanziLine[];
  showPinyin: boolean;
  colorizeTones: boolean;
  onProgressUpdate?: (percent: number) => void;
}

function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, '0')}`;
}

export function VideoPlayerMock({
  title,
  chineseTitle,
  thumbnailUrl,
  videoUrl,
  durationLabel,
  durationSec,
  hanziLines,
  showPinyin,
  colorizeTones,
  onProgressUpdate,
}: VideoPlayerMockProps) {
  const isDirectVideoFile =
    videoUrl.startsWith('http://') ||
    videoUrl.startsWith('https://') ||
    videoUrl.startsWith('blob:') ||
    videoUrl.startsWith('data:video');

  const safeDuration = Math.max(120, durationSec || 180);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [speed, setSpeed] = useState<0.75 | 1 | 1.25>(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [useInteractiveMock, setUseInteractiveMock] = useState(!isDirectVideoFile);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentSec(0);
    setUseInteractiveMock(!isDirectVideoFile);
  }, [title, videoUrl, isDirectVideoFile]);

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.round(1000 / speed);
    const id = window.setInterval(() => {
      setCurrentSec((prev) => Math.min(safeDuration, prev + 1));
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [isPlaying, speed, safeDuration]);

  useEffect(() => {
    if (currentSec >= safeDuration && isPlaying) {
      setIsPlaying(false);
      onProgressUpdate?.(100);
      return;
    }
    if (currentSec > 0 && currentSec % 5 === 0) {
      onProgressUpdate?.(Math.round((currentSec / safeDuration) * 100));
    }
  }, [currentSec, safeDuration, isPlaying, onProgressUpdate]);

  const activeLine = useMemo(() => {
    if (hanziLines.length === 0) return null;
    const matched = [...hanziLines]
      .reverse()
      .find((line, idx) => {
        const stamp = line.timestampSec ?? idx * 45;
        return currentSec >= stamp;
      });
    return matched ?? hanziLines[0];
  }, [hanziLines, currentSec]);

  const cycleSpeed = () => {
    setSpeed((prev) => (prev === 1 ? 1.25 : prev === 1.25 ? 0.75 : 1));
  };

  const seekBy = (delta: number) => {
    setCurrentSec((prev) => Math.min(safeDuration, Math.max(0, prev + delta)));
  };

  const progressPct = Math.min(100, Math.round((currentSec / safeDuration) * 100));

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E9E0D3] bg-[#19201D] shadow-sm">
      {/* Top indicator bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#141A17] px-4 py-2.5 text-xs text-white/80">
        <div className="flex items-center gap-2 min-w-0">
          <SampleBadge variant="sample" label="Жишээ видео тоглуулагч" />
          <span className="truncate font-medium text-white/90">{title}</span>
        </div>
        {isDirectVideoFile && (
          <button
            type="button"
            onClick={() => setUseInteractiveMock((v) => !v)}
            className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#FDE3C8] hover:bg-white/20 cursor-pointer"
          >
            {useInteractiveMock ? 'Оруулсан видео үзэх' : 'Хадмалтай загвар тоглуулагч'}
          </button>
        )}
      </div>

      {/* Viewport */}
      {!useInteractiveMock && isDirectVideoFile ? (
        <div className="relative aspect-video w-full bg-black">
          <video
            src={videoUrl}
            poster={thumbnailUrl}
            controls
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden bg-[#1D2D26]">
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111815]/95 via-[#182720]/65 to-[#182720]/40" />

          {/* Center Lesson Slate */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:pb-24 text-center">
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-[#FDE3C8] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#EB5E43]" />
              <span>Beijing Institute · Видео хичээлийн загвар</span>
            </div>
            <p className="font-hanzi text-lg sm:text-3xl font-bold text-white drop-shadow">
              {chineseTitle}
            </p>
            <p className="mt-0.5 max-w-xl text-xs sm:text-sm text-white/75 line-clamp-1">
              {title} · {durationLabel}
            </p>

            {/* Big Play / Pause Button */}
            <button
              type="button"
              onClick={() => {
                setIsPlaying((p) => !p);
                onProgressUpdate?.(Math.max(15, progressPct));
              }}
              aria-label={isPlaying ? 'Видео түр зогсоох' : 'Видео тоглуулах'}
              className="mt-3 sm:mt-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EB5E43] text-white shadow-lg shadow-[#EB5E43]/30 transition hover:scale-105 hover:bg-[#D44B31] cursor-pointer"
            >
              {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />}
            </button>
          </div>

          {/* Live Synchronized Tri-lingual Subtitles (Desktop/Tablet Overlay) */}
          {showSubtitles && activeLine && (
            <div className="hidden sm:block absolute inset-x-6 bottom-4 rounded-2xl border border-white/15 bg-[#121916]/88 px-4 py-2.5 text-center backdrop-blur-md">
              <p className="font-hanzi text-xl font-bold text-white leading-snug">
                {activeLine.hanzi}
              </p>
              {showPinyin && (
                <p className="mt-0.5 text-sm">
                  <TonePinyin text={activeLine.pinyin} colorize={colorizeTones} />
                </p>
              )}
              <p className="mt-0.5 text-sm font-medium text-[#FDE3C8]">
                {activeLine.mongolian}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mobile Synchronized Subtitles Strip (below video so play button is 100% unobstructed) */}
      {useInteractiveMock && showSubtitles && activeLine && (
        <div className="sm:hidden border-t border-white/10 bg-[#121916] px-4 py-3 text-center">
          <p className="font-hanzi text-base font-bold text-white leading-snug">
            {activeLine.hanzi}
          </p>
          {showPinyin && (
            <p className="mt-0.5 text-xs">
              <TonePinyin text={activeLine.pinyin} colorize={colorizeTones} />
            </p>
          )}
          <p className="mt-0.5 text-xs font-medium text-[#FDE3C8]">
            {activeLine.mongolian}
          </p>
        </div>
      )}

      {/* Control Bar */}
      {useInteractiveMock && (
        <div className="bg-[#151D1A] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-white/75 w-10">
              {formatTime(currentSec)}
            </span>
            <input
              type="range"
              min={0}
              max={safeDuration}
              value={currentSec}
              onChange={(e) => setCurrentSec(Number(e.target.value))}
              aria-label="Видео хугацаа гүйлгэх"
              className="h-1.5 w-full accent-[#EB5E43] cursor-pointer"
            />
            <span className="text-[11px] font-mono text-white/75 w-10 text-right">
              {formatTime(safeDuration)}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#EB5E43] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#D44B31] cursor-pointer"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'Зогсоох' : 'Тоглуулах'}</span>
              </button>
              <button
                type="button"
                onClick={() => seekBy(-10)}
                className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/20 cursor-pointer"
                title="10 секунд ухраах"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>-10с</span>
              </button>
              <button
                type="button"
                onClick={() => seekBy(10)}
                className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/20 cursor-pointer"
                title="10 секунд урагшлуулах"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>+10с</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={cycleSpeed}
                className="rounded-xl bg-white/10 px-2.5 py-1.5 text-xs font-bold text-[#FDE3C8] hover:bg-white/20 cursor-pointer"
              >
                {speed}x хурд
              </button>
              <button
                type="button"
                onClick={() => setShowSubtitles((s) => !s)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold cursor-pointer transition ${
                  showSubtitles
                    ? 'bg-[#25533E] text-white'
                    : 'bg-white/10 text-white/75 hover:bg-white/20'
                }`}
              >
                <Captions className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Хадмал:</span>
                <span>{showSubtitles ? 'Асаалттай' : 'Хаалттай'}</span>
              </button>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/55 pl-1">
                <Volume2 className="h-3.5 w-3.5" />
                Прототип
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
