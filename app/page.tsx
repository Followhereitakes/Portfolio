import OutlierPortfolio from './components/OutlierPortfolio';
import DocumentaryPortfolio from './components/DocumentaryPortfolio';
import FilmPortfolio, { AUNTIE_XUEMEI_PROJECT, IN_HER_AGE_PROJECT, NOT_UNTIL_MIDNIGHT_PROJECT, UNDERFOOT_PROJECT } from './components/FilmPortfolio';
import DerailedPortfolio from './components/DerailedPortfolio';
import PortraitCarousel from './components/PortraitCarousel';
import SkillsServices from './components/SkillsServices';

const projects = [
  ['01', 'Portrait / Editorial', 'A study in presence, gesture and natural light.'],
  ['02', 'Documentary', 'Observed moments with room to breathe.'],
  ['03', 'Fashion Film', 'Movement, texture and a quiet sense of tension.'],
  ['04', 'Live Performance', 'Energy translated without losing intimacy.'],
  ['05', 'Brand Story', 'Human-first stories shaped around a clear idea.'],
  ['06', 'Still Life', 'Objects, surfaces and careful visual rhythm.'],
  ['07', 'Short Film', 'Cinematic narratives built from small details.'],
  ['08', 'Personal Work', 'Ongoing experiments in image and memory.'],
];

export default function Home() {
  return <main>
    <header className="topbar"><a className="brand" href="#top">Yufan Ran</a><nav aria-label="Primary navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav></header>
    <section className="hero" id="top">
      <div className="hero-intro"><span className="role-rotator" aria-label="Multimedia producer, photographer, filmmaker and content creator"><span>Multimedia producer</span><span>Photographer</span><span>Filmmaker</span><span>Content creator</span></span><span>based in London/UK.</span></div>
      <p className="blank-note">(Space for the next moment)</p><h1>Yufan Ran</h1><a className="scroll-cue" href="#manifesto" aria-label="Scroll to introduction">↓</a>
    </section>
    <section className="manifesto" id="manifesto"><p>By the end of the day, you&apos;ll have shot a thousand moments. A thousand. Tomorrow, you&apos;ll remember none. No, your memory isn&apos;t broken. The footage is. Most is rushed, overstuffed, desperate to say everything. I&apos;m here to row against this tide. To leave space instead of filling every frame. To leave silence. To leave a glance that says something unfinished. Quiet. Honest. Present. <strong>Anything but forgettable.</strong></p></section>
    <section className="portfolio" id="work"><div className="section-label">↘︎ PORTFOLIO</div><div className="project-grid">{projects.map(([n,title,copy],i) => i === 0 ? <OutlierPortfolio key={n} /> : i === 1 ? <DocumentaryPortfolio key={n} /> : i === 2 ? <FilmPortfolio key={n} /> : i === 3 ? <FilmPortfolio key={n} project={IN_HER_AGE_PROJECT} number="04" size="small" /> : i === 4 ? <DerailedPortfolio key={n} /> : i === 5 ? <FilmPortfolio key={n} project={AUNTIE_XUEMEI_PROJECT} number="06" videoAspect /> : i === 6 ? <FilmPortfolio key={n} project={UNDERFOOT_PROJECT} number="07" size="medium" videoAspect /> : i === 7 ? <FilmPortfolio key={n} project={NOT_UNTIL_MIDNIGHT_PROJECT} number="08" size="full" videoAspect /> : <article className={`project project-${i+1}`} key={n} tabIndex={0}><div className="project-mark"><span>{n}</span><span>IMAGE / FILM</span></div><div className="project-info"><p>{copy}</p><h2>{title} <span>•</span></h2></div></article>)}</div></section>
    <section className="about" id="about"><div className="eyebrow">WHO?</div><div className="about-grid"><h2>Behind the camera.<br/><strong>Inside the moment.</strong></h2><PortraitCarousel/><p>I&apos;m Yufan Ran, a multimedia producer based in London. This space will become a fuller introduction to my practice, approach, and the experiences that shape the way I see.</p></div></section>
    <SkillsServices/>
    <footer id="contact"><h2>This is not finished.<br/><strong>What will we create next?</strong></h2><div className="contact-grid"><div><small>MAIL</small><a href="mailto:yufan228ran@gmail.com">yufan228ran@gmail.com</a></div><div><small>BASE</small><p>London / UK</p></div><div><small>SOCIAL</small><a href="https://www.instagram.com/current19/" target="_blank" rel="noreferrer">Current19 ↗</a></div></div><p className="footer-name">Yufan Ran</p></footer>
  </main>;
}
