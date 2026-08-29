'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './DerailedPortfolio.module.css';

// Replace or reorder project stills here. The first item is always the cover.
export const DERAILED_PROJECT = {
  title: 'Derailed',
  date: '04/2023',
  pages: Array.from({ length: 7 }, (_, index) => ({
    src: `/derailed/page-${String(index + 1).padStart(2, '0')}.jpg`,
    alt: `Derailed short film still ${index + 1}`,
  })),
};

export default function DerailedPortfolio() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [drag, setDrag] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const pointerStart = useRef<number | null>(null);
  const wheelLock = useRef(false);
  const total = DERAILED_PROJECT.pages.length;

  const move = useCallback((direction: 1 | -1) => {
    setPage(current => Math.max(0, Math.min(total - 1, current + direction)));
    setDrag(0);
  }, [total]);

  const close = useCallback(() => {
    setOpen(false);
    setDrag(0);
  }, []);

  useEffect(() => {
    if (!open) return;
    [page - 1, page + 1].forEach(index => {
      if (index >= 0 && index < total) {
        const image = new Image();
        image.src = DERAILED_PROJECT.pages[index].src;
      }
    });
  }, [open, page, total]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (!open || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointerStart.current = event.clientX;
    rootRef.current?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!open || pointerStart.current === null) return;
    setDrag(Math.max(-180, Math.min(180, event.clientX - pointerStart.current)));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    const threshold = Math.min(80, (rootRef.current?.clientWidth ?? 600) * .12);
    if (Math.abs(distance) >= threshold) move(distance < 0 ? 1 : -1);
    else setDrag(0);
  };

  const onWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (!open || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (wheelLock.current || Math.abs(event.deltaX) < 8) return;
    wheelLock.current = true;
    move(event.deltaX > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLock.current = false; }, 420);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && open) { close(); return; }
    if (!open && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setPage(0);
      setOpen(true);
      return;
    }
    if (open && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  };

  return <article
    ref={rootRef}
    className={`${styles.root} ${open ? styles.reader : ''}`}
    aria-label="Derailed short film stills"
    tabIndex={0}
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    onPointerCancel={() => { pointerStart.current = null; setDrag(0); }}
    onWheel={onWheel}
    onKeyDown={onKeyDown}
  >
    <header className={styles.header}>
      <span>05</span>
      <p>{DERAILED_PROJECT.date}</p>
    </header>

    <div className={styles.meta}><h2>{DERAILED_PROJECT.title}</h2></div>

    <button className={styles.cover} type="button" onClick={() => { setPage(0); setOpen(true); }} aria-label="View Derailed stills">
      <img src={DERAILED_PROJECT.pages[0].src} alt="Derailed cover still" loading="lazy" decoding="async" draggable={false} />
      <span>View</span>
    </button>

    <div className={styles.readerStage} aria-hidden={!open}>
      {open && DERAILED_PROJECT.pages.map((item, index) => {
        const relative = index - page;
        if (Math.abs(relative) > 1) return null;
        return <figure
          className={styles.sheet}
          key={item.src}
          style={{
            transform: `translate3d(calc(${relative * 92}% + ${drag}px),0,0) scale(${relative === 0 ? 1 : .94})`,
            opacity: relative === 0 ? 1 : .38,
            zIndex: 3 - Math.abs(relative),
          }}
        ><img src={item.src} alt={item.alt} loading={relative === 0 ? 'eager' : 'lazy'} decoding="async" draggable={false} /></figure>;
      })}
    </div>

    <div className={styles.controls} aria-hidden={!open}>
      <span>{String(page + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <div className={styles.arrows}>
        <button type="button" disabled={page === 0} onPointerDown={event => event.stopPropagation()} onClick={() => move(-1)} aria-label="Previous still">←</button>
        <button type="button" disabled={page === total - 1} onPointerDown={event => event.stopPropagation()} onClick={() => move(1)} aria-label="Next still">→</button>
      </div>
      <button className={styles.back} type="button" onPointerDown={event => event.stopPropagation()} onClick={close}>Back to Project</button>
    </div>
  </article>;
}
