import Hero3D from './Hero3D';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.canvasContainer}>
        <Hero3D />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Artistry in <br /> Every Detail</h1>
        <p className={styles.subtitle}>
          Experience the pinnacle of hair artistry and wellness. <br />
          Where luxury meets minimalist elegance.
        </p>
        <button className={styles.ctaButton} style={{
          padding: '1rem 2.5rem',
          background: 'var(--primary)',
          color: 'var(--background)',
          border: 'none',
          borderRadius: '0',
          fontSize: '0.85rem',
          letterSpacing: '3px',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          textTransform: 'uppercase',
          fontWeight: '500',
          transition: 'all 0.3s ease'
        }}>
          Explore Services
        </button>
      </div>
    </section>
  );
}
