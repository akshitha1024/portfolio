
import Image from 'next/image';
import styles from './CircularTechStack.module.css';
import { useEffect, useRef } from 'react';

const techs = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'TypeScript', icon: '🟦' },
  { name: 'Node.js', icon: '🟩' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'CSS/SCSS', icon: '🎨' },
  { name: 'Firebase', icon: '🔥' },
];

export default function CircularTechStack() {
  const iconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let req: number;
    const animate = () => {
      if (iconsRef.current) {
        const icons = iconsRef.current.children;
        for (let i = 0; i < icons.length; i++) {
          // Animate each icon's angle from top (0deg) to bottom (180deg)
          const radius = 400 + 30;
          // -90deg: start at top, go to bottom on right
          const angle90 = (Math.PI * i) / (icons.length - 1) - Math.PI / 2;
          // Animate offset
          const offset = (frame / 120) % (2 * Math.PI);
          const angle = (angle90 + offset) % Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          (icons[i] as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
        }
      }
      frame++;
      req = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(req);
  }, []);

  return (
    <div className={styles.circleWrapper}>
      <div className={styles.centralPhoto}>
        <Image src="/assets/profile1.jpg" alt="Profile" width={780} height={780} style={{ borderRadius: '50%' }} />
      </div>
      {/* Semicircle border on right side (mirrored) */}
      <svg className={styles.semicircleBorder} width="820" height="820" viewBox="0 0 820 820">
        <path d="M 410 10 A 400 400 0 0 0 410 810" stroke="#e0b354" strokeWidth="18" fill="none" />
      </svg>
      <div className={styles.semicircleIcons} ref={iconsRef}>
        {techs.map((tech, i) => (
          <div key={tech.name} className={styles.techIcon} title={tech.name}>
            <span style={{ fontSize: '2.5em' }}>{tech.icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
