'use client';

import { flushSync } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './DocumentaryPortfolio.module.css';

// REPLACE DOCUMENTARY CONTENT HERE: edit title, information, page paths, or array order.
export const DOCUMENTARY_PROJECT = {
  title: 'The Whisper of Trees',
  info: '09/2024',
  pages: Array.from({ length: 16 }, (_, index) => ({
    src: `/documentary/page-${String(index + 1).padStart(2, '0')}.jpg`,
    alt: `The Whisper of Trees documentary proposal — page ${index + 1}`,
  })),
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export default function DocumentaryPortfolio() {
  const [mode, setMode] = useState<'cover' | 'reader'>('cover');
  const [page, setPage] = useState(0);
  const [drag, setDrag] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const pointerStart = useRef<number | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelLock = useRef(false);
  const total = DOCUMENTARY_PROJECT.pages.length;

  const transition = useCallback((update: () => void) => {
    const doc = document as ViewTransitionDocument;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !doc.startViewTransition) {
      update();
      return;
    }
    doc.startViewTransition(() => flushSync(update));
  }, []);

  const showCover = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    transition(() => { setMode('cover'); setDrag(0); });
  }, [transition]);

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(showCover, 6500);
  }, [showCover]);

  const enterReader = useCallback((target = page) => {
    setPage(Math.max(0, Math.min(total - 1, target)));
    transition(() => setMode('reader'));
    resetIdle();
  }, [page, resetIdle, total, transition]);

  const move = useCallback((direction: 1 | -1) => {
    setPage(current => Math.max(0, Math.min(total - 1, current + direction)));
    setDrag(0);
    resetIdle();
  }, [resetIdle, total]);

  useEffect(() => {
    if (mode !== 'reader') return;
    [page - 1, page + 1].forEach(index => {
      if (index >= 0 && index < total) {
        const image = new Image();
        image.src = DOCUMENTARY_PROJECT.pages[index].src;
      }
    });
    resetIdle();
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [mode, page, resetIdle, total]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (mode === 'cover') enterReader(0);
    pointerStart.current = event.clientX;
    rootRef.current?.setPointerCapture(event.pointerId);
    resetIdle();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (pointerStart.current === null || mode !== 'reader') return;
    setDrag(Math.max(-190, Math.min(190, event.clientX - pointerStart.current)));
    resetIdle();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    const threshold = Math.min(90, (rootRef.current?.clientWidth ?? 700) * .12);
    if (Math.abs(distance) >= threshold) move(distance > 0 ? 1 : -1);
    else setDrag(0);
  };

  const onWheel = (event: React.WheelEvent<HTMLElement>) => {
    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) * .8;
    if (mode === 'cover' && !horizontalIntent) return;
    if (mode === 'cover') {
      event.preventDefault();
      enterReader(0);
      return;
    }
    event.preventDefault();
    resetIdle();
    if (wheelLock.current) return;
    const delta = horizontalIntent ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 8) return;
    wheelLock.current = true;
    move(delta > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLock.current = false; }, 420);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') { showCover(); return; }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      if (mode === 'cover') enterReader(0);
      else move(event.key === 'ArrowRight' ? 1 : -1);
    }
  };

  return <article
    ref={rootRef}
    className={`${styles.root} ${mode === 'reader' ? styles.reader : styles.coverMode}`}
    aria-label={`${DOCUMENTARY_PROJECT.title} documentary portfolio`}
    tabIndex={0}
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    onPointerCancel={() => { pointerStart.current = null; setDrag(0); }}
    onPointerLeave={() => { if (pointerStart.current === null && mode === 'reader') showCover(); }}
    onWheel={onWheel}
    onKeyDown={onKeyDown}
  >
    <header className={styles.header}>
      <div><span>02</span><h2>{DOCUMENTARY_PROJECT.title}</h2></div>
      <p>{DOCUMENTARY_PROJECT.info}</p>
    </header>

    <figure className={styles.cover} aria-hidden={mode === 'reader'} data-page-index="0">
      <img
        src={DOCUMENTARY_PROJECT.pages[0].src}
        alt="The Whisper of Trees documentary proposal cover"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <figcaption>Drag to explore</figcaption>
    </figure>

    <div className={styles.readerStage} aria-hidden={mode === 'cover'}>
      {DOCUMENTARY_PROJECT.pages.map((item, index) => {
        const relative = index - page;
        if (Math.abs(relative) > 1) return null;
        return <figure
          className={styles.sheet}
          data-page-index={index}
          key={item.src}
          style={{
            transform: `translate3d(calc(${relative * 88}% + ${drag}px), 0, 0) scale(${relative === 0 ? 1 : .92})`,
            opacity: relative === 0 ? 1 : .45,
            zIndex: 3 - Math.abs(relative),
            viewTransitionName: relative === 0 ? 'documentary-active-page' : undefined,
          }}
        ><img src={item.src} alt={item.alt} loading={relative === 0 ? 'eager' : 'lazy'} decoding="async" draggable={false} /></figure>;
      })}
    </div>

    <div className={styles.controls} aria-hidden={mode === 'cover'}>
      <span>{String(page + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <span className={styles.hint}>Drag to explore</span>
      <button type="button" onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); showCover(); }}>Cover</button>
    </div>
  </article>;
}
