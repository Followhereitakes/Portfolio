import styles from './PortraitCarousel.module.css';

const portraits = [
  { src: '/about/portrait-01.jpg', alt: 'Yufan Ran self portrait in a mirror' },
  { src: '/about/portrait-02.jpg', alt: 'Yufan Ran black and white portrait' },
  { src: '/about/portrait-03.jpg', alt: 'Yufan Ran operating a video camera' },
];

export default function PortraitCarousel() {
  return <figure className={styles.root} aria-label="Portraits of Yufan Ran">
    <div className={styles.track}>
      {portraits.map((portrait, index) => <div className={`${styles.slide} ${index === 2 ? styles.fill : ''}`} key={portrait.src}>
        <img src={portrait.src} alt={portrait.alt} loading="lazy" decoding="async" />
      </div>)}
      <div className={styles.slide} aria-hidden="true">
        <img src={portraits[0].src} alt="" loading="lazy" decoding="async" />
      </div>
    </div>
  </figure>;
}
