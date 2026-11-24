import { useEffect, useId, useRef, useState, type ComponentProps } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from 'motion/react';
import { cn } from '../../lib/utils';

const LEVELS = [
  { label: 'Сул', color: '#EB5E43' },
  { label: 'Дунд', color: '#E69214' },
  { label: 'Сайн', color: '#2B5C8F' },
  { label: 'Хүчтэй', color: '#25533E' },
] as const;

const LID_OPEN = { top: 5.5, bottom: 18.5 };
const LID_CLOSED = { top: 17, bottom: 17 };
const LASHES = [
  'M4.4 14.6 3 16.4',
  'M9 16.6 8.5 19',
  'M15 16.6l.5 2.4',
  'M19.6 14.6l1.4 1.8',
];

const INSTANT: Transition = { duration: 0 };
const SPRING: Transition = { type: 'spring', stiffness: 520, damping: 32 };
const LID_SPRING: Transition = { type: 'spring', stiffness: 500, damping: 34 };
const SWAP: Transition = { duration: 0.12, ease: 'easeOut' };
const REVEAL: Transition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] };
const BLINK: Transition = {
  duration: 1.1,
  times: [0, 0.5, 0.5, 1],
  repeat: Infinity,
  ease: 'linear',
};

const corner = (y: number) => 12 + (y - 12) * 0.64;

const eyePath = ({ top, bottom }: { top: number; bottom: number }) =>
  `M2 12C4 ${corner(top)} 7.5 ${top} 12 ${top}C16.5 ${top} 20 ${corner(top)} 22 12C20 ${corner(bottom)} 16.5 ${bottom} 12 ${bottom}C7.5 ${bottom} 4 ${corner(bottom)} 2 12Z`;

export function passwordStrength(value: string) {
  if (!value) return 0;
  const score = [
    value.length >= 8,
    value.length >= 12,
    /[a-z]/.test(value) && /[A-Z]/.test(value),
    /\d/.test(value),
    /[^a-zA-Z0-9]/.test(value),
  ].filter(Boolean).length;
  return Math.min(Math.max(score, 1), LEVELS.length);
}

function Glyph({
  char,
  visible,
  reduceMotion,
}: {
  char: string;
  visible: boolean;
  reduceMotion: boolean;
}) {
  const transition = reduceMotion ? INSTANT : SWAP;

  return (
    <span className="relative grid h-full w-[1ch] shrink-0 place-items-center">
      <motion.span
        data-slot="password-input-dot"
        initial={false}
        animate={{ opacity: visible ? 0 : 1 }}
        transition={transition}
        className="absolute size-[0.36em] rounded-full bg-current"
      />
      <motion.span
        data-slot="password-input-char"
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={transition}
        className="whitespace-pre"
      >
        {char}
      </motion.span>
    </span>
  );
}

function Eye({ open, reduceMotion }: { open: boolean; reduceMotion: boolean }) {
  const clipId = useId();
  const lid = { d: eyePath(open ? LID_OPEN : LID_CLOSED) };
  const transition = reduceMotion ? INSTANT : LID_SPRING;

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 overflow-visible"
    >
      <clipPath id={clipId}>
        <motion.path initial={false} animate={lid} transition={transition} />
      </clipPath>
      <circle cx={12} cy={12} r={3} clipPath={`url(#${clipId})`} />
      <motion.path initial={false} animate={lid} transition={transition} />
      {LASHES.map((d) => (
        <motion.path
          key={d}
          d={d}
          initial={false}
          animate={{ pathLength: open ? 0 : 1, opacity: open ? 0 : 1 }}
          transition={
            reduceMotion ? INSTANT : { duration: 0.2, delay: open ? 0 : 0.08 }
          }
        />
      ))}
    </svg>
  );
}

export type PasswordInputProps = Omit<
  ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  strength?: boolean;
  strengthTitle?: string;
  toggleAriaLabel?: string;
  inputClassName?: string;
};

export function PasswordInput({
  value,
  defaultValue = '',
  onChange,
  defaultVisible = false,
  onVisibleChange,
  strength = true,
  strengthTitle = 'Нууц үгийн найдвартай байдал',
  toggleAriaLabel = 'Нууц үг харах/нуух',
  placeholder,
  disabled,
  autoComplete = 'current-password',
  className,
  inputClassName,
  onFocus,
  onBlur,
  ...props
}: PasswordInputProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [visible, setVisible] = useState(defaultVisible);
  const [focused, setFocused] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0, scroll: 0 });
  const input = useRef<HTMLInputElement>(null);
  const frame = useRef(0);
  const reduceMotion = useReducedMotion() ?? false;

  const password = value ?? uncontrolled;
  const chars = Array.from(password);
  const level = passwordStrength(password);
  const animated = (transition: Transition) =>
    reduceMotion ? INSTANT : transition;

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const read = () => {
    const el = input.current;
    if (!el) return;
    // selection offsets count utf-16 units, the glyphs count code points
    const start = Array.from(el.value.slice(0, el.selectionStart ?? 0)).length;
    const end = Array.from(el.value.slice(0, el.selectionEnd ?? 0)).length;
    const scroll = el.scrollLeft;
    setSelection((current) =>
      current.start === start &&
      current.end === end &&
      current.scroll === scroll
        ? current
        : { start, end, scroll }
    );
  };

  // read now so the caret moves with the keystroke, then again once scrollLeft settles
  const sync = () => {
    read();
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(read);
  };

  const toggle = () => {
    const el = input.current;
    const start = el?.selectionStart ?? null;
    const end = el?.selectionEnd ?? null;
    const nextVisible = !visible;
    setVisible(nextVisible);
    onVisibleChange?.(nextVisible);
    // switching the input type drops the selection in some browsers
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (el && start !== null && end !== null && document.activeElement === el)
        el.setSelectionRange(start, end);
      read();
    });
  };

  return (
    <div
      data-slot="password-input"
      data-visible={visible}
      className={cn(
        'relative flex w-full flex-col',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      <div
        data-slot="password-input-field"
        className={cn(
          'relative flex h-12 items-center rounded-2xl border bg-[#FAF4EA] text-[#1A1A1A] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors',
          focused ? 'border-[#25533E] bg-white ring-2 ring-[#25533E]/15' : 'border-[#E5DDD0]'
        )}
      >
        <div className="relative h-full min-w-0 flex-1">
          <input
            ref={input}
            {...props}
            type={visible ? 'text' : 'password'}
            value={password}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            data-slot="password-input-control"
            onChange={(event) => {
              if (value === undefined) setUncontrolled(event.target.value);
              onChange?.(event.target.value);
              sync();
            }}
            onSelect={sync}
            onScroll={sync}
            onFocus={(event) => {
              setFocused(true);
              sync();
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            className={cn(
              'absolute inset-0 size-full bg-transparent pl-4 pr-2 font-mono text-base text-transparent caret-transparent outline-none [-webkit-text-fill-color:transparent] selection:bg-transparent placeholder:text-transparent autofill:shadow-[inset_0_0_0_100px_#FAF4EA] [&::-ms-reveal]:hidden',
              inputClassName
            )}
          />

          <div
            aria-hidden
            data-slot="password-input-display"
            className="pointer-events-none absolute inset-y-0 left-4 right-2 overflow-hidden font-mono text-base"
          >
            {!password && placeholder && (
              <span className="absolute inset-y-0 left-0 flex items-center font-sans text-sm text-[#8E8578]">
                {placeholder}
              </span>
            )}

            <div
              className="relative flex h-full items-center"
              style={{ transform: `translateX(${-selection.scroll}px)` }}
            >
              {focused && selection.end > selection.start && (
                <span
                  className="absolute top-1/2 h-6 -translate-y-1/2 rounded bg-[#EB5E43]/25"
                  style={{
                    left: `${selection.start}ch`,
                    width: `${selection.end - selection.start}ch`,
                  }}
                />
              )}

              {chars.map((char, index) => (
                <Glyph
                  key={index}
                  char={char}
                  visible={visible}
                  reduceMotion={reduceMotion}
                />
              ))}

              {focused && selection.start === selection.end && (
                <motion.span
                  // remounting restarts the blink, so the caret stays solid while typing
                  key={`${selection.end}:${chars.length}`}
                  data-slot="password-input-caret"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={BLINK}
                  style={{ left: `${selection.end}ch` }}
                  className="absolute top-1/2 -ml-px h-5 w-0.5 -translate-y-1/2 rounded-full bg-[#1A1A1A]"
                />
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          data-slot="password-input-toggle"
          aria-label={toggleAriaLabel}
          aria-pressed={visible}
          disabled={disabled}
          onPointerDown={(event) => event.preventDefault()}
          onClick={toggle}
          className="mr-1.5 grid size-9 shrink-0 place-items-center rounded-xl text-[#5C5C5C] outline-none transition-colors hover:bg-[#FDE3C8]/60 hover:text-[#1A1A1A] focus-visible:ring-2 focus-visible:ring-[#EB5E43]/60 cursor-pointer"
        >
          <Eye open={visible} reduceMotion={reduceMotion} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {strength && level > 0 && (
          <motion.div
            data-slot="password-input-strength"
            data-level={level}
            initial={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
            transition={animated(REVEAL)}
            // out of flow so the field stays put when the meter appears
            className="absolute inset-x-0 top-full"
          >
            <div className="flex flex-col gap-1.5 px-1 pt-2.5">
              <div className="flex gap-1.5">
                {LEVELS.map((entry, index) => (
                  <span
                    key={entry.label}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-[#E5DDD0]"
                  >
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: index < level ? 1 : 0,
                        backgroundColor: LEVELS[level - 1].color,
                      }}
                      transition={animated({ ...SPRING, delay: index * 0.04 })}
                      className="block h-full origin-left rounded-full"
                    />
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5C5C5C]">{strengthTitle}</span>
                <span
                  aria-live="polite"
                  className="relative flex h-4 justify-end overflow-hidden font-bold text-[#1A1A1A]"
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                      key={level}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={animated(SPRING)}
                    >
                      {LEVELS[level - 1].label}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PasswordInput;
