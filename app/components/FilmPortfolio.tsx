'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './FilmPortfolio.module.css';

// REPLACE FILM CONTENT HERE: title, date, poster, and web-video source.
export type FilmProject = {
  title: string;
  date: string;
  poster: string;
  video: string;
  aspectRatio?: string;
  fillCover?: boolean;
};

export const FILM_PROJECT: FilmProject = {
  title: 'Lucas de Abreu Maia',
  date: '12/2025',
  poster: '/lucas/poster.png',
  video: '/lucas/lucas-web.mp4',
  fillCover: true,
};

export const IN_HER_AGE_PROJECT: FilmProject = {
  title: 'In Her Age',
  date: '08/2026',
  poster: '/in-her-age/poster.png',
  video: '/in-her-age/in-her-age-web.mp4',
  fillCover: true,
};

export const AUNTIE_XUEMEI_PROJECT: FilmProject = {
  title: 'Auntie Xuemei',
  date: '08/2025',
  poster: '/auntie-xuemei/poster.png',
  video: '/auntie-xuemei/auntie-xuemei-web.mp4',
  aspectRatio: '8 / 5',
  fillCover: true,
};

export const UNDERFOOT_PROJECT: FilmProject = {
  title: 'Underfoot',
  date: '10/2025',
  poster: '/underfoot/poster.png',
  video: '/underfoot/underfoot-web.mp4',
};

export const NOT_UNTIL_MIDNIGHT_PROJECT: FilmProject = {
  title: 'Not Until Midnight',
  date: '09/2026',
  poster: '/not-until-midnight/poster.png',
  video: '/not-until-midnight/not-until-midnight-web.mp4',
  aspectRatio: '2250 / 1366',
  fillCover: true,
};

type FilmPortfolioProps = {
  project?: FilmProject;
  number?: string;
  size?: 'full' | 'large' | 'medium' | 'small';
  videoAspect?: boolean;
};

export default function FilmPortfolio({ project = FILM_PROJECT, number = '03', size = 'large', videoAspect = false }: FilmPortfolioProps) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [close, open]);

  return <>
    <article
      className={`${styles.root} ${size === 'full' ? styles.full : size === 'small' ? styles.small : size === 'medium' ? styles.medium : ''} ${videoAspect ? styles.videoAspect : ''} ${project.fillCover ? styles.fillCover : ''}`}
      style={project.aspectRatio ? { aspectRatio: project.aspectRatio } : undefined}
      aria-label={`${project.title}, film`}
    >
      <img className={styles.poster} src={project.poster} alt={`Film still from ${project.title}`} loading="lazy" decoding="async" />
      <div className={styles.scrim} />
      <div className={styles.index}>{number}</div>
      <p className={styles.date}>{project.date}</p>
      <div className={styles.meta}><h2>{project.title}</h2></div>
      <button className={styles.watch} type="button" onClick={() => setOpen(true)} aria-label="Play full film">
        <span aria-hidden="true" />
      </button>
    </article>

    {open && createPortal(
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`${project.title} full film`}>
        <div className={styles.modalHeader}>
          <div><span>{number} / Film</span><strong>{project.title}</strong><span>{project.date}</span></div>
          <button type="button" onClick={close} aria-label="Close film player">Close <b aria-hidden="true">×</b></button>
        </div>
        <div className={styles.playerFrame}>
          <video
            ref={videoRef}
            controls
            playsInline
            preload="none"
            poster={project.poster}
            src={project.video}
          >
            Your browser does not support HTML video.
          </video>
        </div>
        <p className={styles.playerHint}>Press play to begin · Esc to close</p>
      </div>,
      document.body,
    )}
  </>;
}
