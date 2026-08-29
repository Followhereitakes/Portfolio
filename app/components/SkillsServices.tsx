'use client';

import { useState } from 'react';
import styles from './SkillsServices.module.css';

const services = [
  {
    number: '01',
    title: 'Photography',
    description: 'I create observational photography rooted in everyday life, exploring solitude, intimacy and the subtle emotional relationships between people and their surroundings.',
    keywords: ['DOCUMENTARY', 'PORTRAIT', 'EDITORIAL', 'STREET'],
  },
  {
    number: '02',
    title: 'Cinematography',
    description: 'I work with natural light, restrained camera movement and carefully composed images to create intimate, atmospheric visual narratives.',
    keywords: ['CAMERA OPERATION', 'VISUAL RESEARCH', 'LIGHTING', 'SHOT DESIGN'],
  },
  {
    number: '03',
    title: 'Content Creation',
    description: 'I produce thoughtful visual content for artists, cultural organisations and independent projects, adapting each story across photography and moving image.',
    keywords: ['SOCIAL CONTENT', 'CAMPAIGNS', 'SHORT-FORM VIDEO', 'BEHIND THE SCENES'],
  },
  {
    number: '04',
    title: 'Documentary Filmmaking',
    description: 'I develop character-led documentaries that explore personal experience within wider social and cultural contexts, using observation, research and close collaboration with contributors.',
    keywords: ['RESEARCH', 'INTERVIEWING', 'DIRECTING', 'FIELD PRODUCTION'],
  },
  {
    number: '05',
    title: 'Creative Direction',
    description: 'I build a coherent visual language for each project, from initial research and concept development to visual references, treatments and final presentation.',
    keywords: ['CONCEPT DEVELOPMENT', 'VISUAL IDENTITY', 'TREATMENTS', 'ART DIRECTION'],
  },
];

export default function SkillsServices() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return <section className="services">
    <h2>↘︎ Skills &amp; Services</h2>
    <div className={styles.list}>
      {services.map((service, index) => {
        const expanded = openIndex === index;
        const panelId = `service-panel-${service.number}`;
        return <article className={styles.item} key={service.number}>
          <button
            className={styles.trigger}
            type="button"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setOpenIndex(expanded ? null : index)}
          >
            <span className={styles.number}>({service.number})</span>
            <span className={styles.title}>{service.title}</span>
            <span className={styles.symbol} aria-hidden="true">{expanded ? '×' : '+'}</span>
          </button>
          <div className={`${styles.panel} ${expanded ? styles.open : ''}`} id={panelId} aria-hidden={!expanded}>
            <div className={styles.panelClip}>
              <div className={styles.body}>
                <span className={styles.spacer} aria-hidden="true" />
                <p>{service.description}</p>
                <ul>{service.keywords.map(keyword => <li key={keyword}>{keyword}</li>)}</ul>
              </div>
            </div>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
