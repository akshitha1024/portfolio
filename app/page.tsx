'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './page.module.css'
import Loading from './loading'
import CircularTechStack from './CircularTechStack'

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [skillsAssembled, setSkillsAssembled] = useState(false)
  const [skillsAnimating, setSkillsAnimating] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Center Featured Work cards on initial render
  useEffect(() => {
    // Wait for DOM to be ready and loading to be done
    if (!isLoading && mounted) {
      setTimeout(() => {
        const grid = document.querySelector(`.${styles.projectsGrid}`) as HTMLElement;
        if (grid) {
          const card = grid.querySelectorAll(`.${styles.projectCard}`);
          if (card.length > 0) {
            // Center the first card at the start
            const gridRect = grid.getBoundingClientRect();
            const cardElem = card[0] as HTMLElement;
            const cardRect = cardElem.getBoundingClientRect();
            const scrollTo = cardElem.offsetLeft - (gridRect.width / 2) + (cardRect.width / 2);
            grid.scrollTo({ left: scrollTo, behavior: 'auto' });
          }
        }
      }, 100);
    }
  }, [isLoading, mounted]);

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }

    // Force loading screen to show for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-skills', skillsAssembled ? 'assembled' : 'scattered')
  }, [skillsAssembled])

  useEffect(() => {
    document.documentElement.setAttribute('data-skills-anim', skillsAnimating ? 'active' : 'inactive')
  }, [skillsAnimating])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  if (!mounted || isLoading) return <Loading />

  // Calculate parallax offset based on mouse position
  const calculateParallax = (speed: number) => {
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
    const offsetX = (mousePosition.x - centerX) * speed
    const offsetY = (mousePosition.y - centerY) * speed
    return { x: offsetX, y: offsetY }
  }

  return (
    <div id="top" className={styles.container}>
      {/* Floating Background Words */}
      <div className={styles.floatingBg}>
        <span 
          className={styles.floatingText + ' ' + styles.float1}
          style={{
            transform: `translate(${calculateParallax(0.02).x}px, ${calculateParallax(0.02).y}px)`
          }}
        >
          FRONTEND DEVELOPER
        </span>
        <span 
          className={styles.floatingText + ' ' + styles.float2}
          style={{
            transform: `translate(${calculateParallax(0.015).x}px, ${calculateParallax(0.015).y}px)`
          }}
        >
          BACKEND DEVELOPER
        </span>
        <span 
          className={styles.floatingText + ' ' + styles.float3}
          style={{
            transform: `translate(${calculateParallax(0.025).x}px, ${calculateParallax(0.025).y}px)`
          }}
        >
          FULL STACK DEVELOPER
        </span>
        <span 
          className={styles.floatingText + ' ' + styles.float4}
          style={{
            transform: `translate(${calculateParallax(0.018).x}px, ${calculateParallax(0.018).y}px)`
          }}
        >
          UI/UX DEVELOPER
        </span>
        <span 
          className={styles.floatingText + ' ' + styles.float5}
          style={{
            transform: `translate(${calculateParallax(0.022).x}px, ${calculateParallax(0.022).y}px)`
          }}
        >
          SOFTWARE ENGINEER
        </span>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <Link href="/#top" className={styles.logo} aria-label="Go to home">
              <Image
                src="/assets/logo.png?v=2"
                alt="Logo"
                width={100}
                height={60}
              />
            </Link>
            <span className={styles.nameText}>AKSHITHA CHAPALAMADUGU</span>
          </div>
          <div className={styles.headerActions}>
            <Link
              href="/about"
              className={styles.headerButton + ' ' + styles.scatterText}
              aria-label="Go to About page"
              onMouseEnter={() => { setSkillsAnimating(true); setSkillsAssembled(true) }}
              onMouseLeave={() => {
                setSkillsAssembled(false)
                setSkillsAnimating(true)
                setTimeout(() => setSkillsAnimating(false), 850)
              }}
              onFocus={() => { setSkillsAnimating(true); setSkillsAssembled(true) }}
              onBlur={() => {
                setSkillsAssembled(false)
                setSkillsAnimating(true)
                setTimeout(() => setSkillsAnimating(false), 850)
              }}
            >
              <span className={styles.letter}>A</span>
              <span className={styles.letter}>b</span>
              <span className={styles.letter}>o</span>
              <span className={styles.letter}>u</span>
              <span className={styles.letter}>t</span>
              <span className={styles.aboutArrow} title="Go to About section">↓</span>
            </Link>
            <Link href="/contact" className={styles.headerButton + ' ' + styles.headerButtonPrimary} aria-label="Go to contact page">Contact</Link>
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '🌞'}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          <a href="#about" className={styles.navItem}>About</a>
          <a href="#projects" className={styles.navItem}>Projects</a>
          <a href="#skills" className={styles.navItem}>Skills</a>
          <a href="#experience" className={styles.navItem}>Experience</a>
          <a href="#contact" className={styles.navItem}>Contact</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={styles.contentWrapper}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero and About Section - Side by Side */}
        <div className={styles.heroAboutWrapper}>
          <div className={styles.heroContainer}>
            <span className={styles.heroSubtitle}>CREATIVE</span>
            <h1 className={styles.hero}>
              DESIGNER
              <br />
              <span className={styles.heroAmpersand}>& </span>
              <br />
              DEVELOPER
            </h1>
          </div>
          <div
            id="about"
            className={styles.aboutSection}
            onMouseEnter={() => { setSkillsAnimating(true); setSkillsAssembled(true) }}
            onMouseLeave={() => {
              setSkillsAssembled(false)
              setSkillsAnimating(true)
              setTimeout(() => setSkillsAnimating(false), 850)
            }}
          >
            <div className={styles.availableBadge}>🟢 Available for Opportunities</div>
            <p className={styles.aboutText}>
              I'm a passionate developer who loves building elegant, user-friendly web applications. Whether it's crafting interactive frontends or optimizing code, I enjoy solving complex problems and creating solutions that make a real impact. Let's build something amazing together.
            </p>
            <div className={styles.skillsContainer}>
              <div className={styles.skillBadge}>UI/UX Design</div>
              <div className={styles.skillBadge}>Frontend Dev</div>
              <div className={styles.skillBadge}>Responsive Design</div>
              <div className={styles.skillBadge}>Web Development</div>
            </div>
          </div>
        </div>

        {/* What I Do Section */}
        <section className={styles.whatIDoSection}>
          <h2 className={styles.sectionTitle}>What I Do</h2>
          <button
            className={`${styles.carouselNavBtn} ${styles.left}`}
            aria-label="Scroll left"
            type="button"
            onClick={() => {
              const grid = document.querySelector(`.${styles.servicesGrid}`) as HTMLElement;
              if (grid) grid.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
            }}
          >
            &lt;
          </button>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard} style={{backgroundImage: "url('/assets/web-dev.png')"}}>
              <div className={styles.serviceContent}>
                <p className={styles.serviceSubtitle}>Custom designs made for you</p>
                <h3 className={styles.serviceTitle}>Web Development</h3>
                <p className={styles.serviceDesc}>Building responsive, high-performance web applications with modern frameworks and best practices tailored to your unique vision.</p>
                <div className={styles.serviceTags}>
                  <span className={styles.serviceTag}>Custom Themes</span>
                  <span className={styles.serviceTag}>Responsive Design</span>
                  <span className={styles.serviceTag}>Modern Frameworks</span>
                  <span className={styles.serviceTag}>Performance Optimization</span>
                </div>
              </div>
            </div>
            <div className={styles.serviceCard} style={{backgroundImage: "url('/assets/ui-ux.jpg')"}}>
              <div className={styles.serviceContent}>
                <p className={styles.serviceSubtitle}>We're always innovating</p>
                <h3 className={styles.serviceTitle}>UI/UX Design</h3>
                <p className={styles.serviceDesc}>Crafting intuitive and beautiful user interfaces that provide exceptional user experiences and drive engagement.</p>
                <div className={styles.serviceTags}>
                  <span className={styles.serviceTag}>User Research</span>
                  <span className={styles.serviceTag}>Prototyping</span>
                  <span className={styles.serviceTag}>Visual Design</span>
                  <span className={styles.serviceTag}>Accessibility</span>
                </div>
              </div>
            </div>
            <div className={styles.serviceCard} style={{backgroundImage: "url('/assets/full-stack.jpg')"}}>
              <div className={styles.serviceContent}>
                <p className={styles.serviceSubtitle}>End-to-end solutions</p>
                <h3 className={styles.serviceTitle}>Full Stack Development</h3>
                <p className={styles.serviceDesc}>Complete development from database design to frontend implementation, delivering seamless and scalable solutions.</p>
                <div className={styles.serviceTags}>
                  <span className={styles.serviceTag}>Database Design</span>
                  <span className={styles.serviceTag}>API Development</span>
                  <span className={styles.serviceTag}>Frontend Integration</span>
                  <span className={styles.serviceTag}>Cloud Deployment</span>
                </div>
              </div>
            </div>
            <div className={styles.serviceCard} style={{backgroundImage: "url('/assets/api.jpg')"}}>
              <div className={styles.serviceContent}>
                <p className={styles.serviceSubtitle}>Seamless integrations</p>
                <h3 className={styles.serviceTitle}>API Development</h3>
                <p className={styles.serviceDesc}>Designing and building robust RESTful APIs with comprehensive documentation and secure authentication systems.</p>
                <div className={styles.serviceTags}>
                  <span className={styles.serviceTag}>RESTful APIs</span>
                  <span className={styles.serviceTag}>Authentication</span>
                  <span className={styles.serviceTag}>Third-party Integration</span>
                  <span className={styles.serviceTag}>API Documentation</span>
                </div>
              </div>
            </div>
          </div>
          <button
            className={`${styles.carouselNavBtn} ${styles.right}`}
            aria-label="Scroll right"
            type="button"
            onClick={() => {
              const grid = document.querySelector(`.${styles.servicesGrid}`) as HTMLElement;
              if (grid) grid.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
            }}
          >
            &gt;
          </button>
        </section>

        {/* Featured Projects Section */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Work</h2>
          <button
            className={`${styles.carouselNavBtn} ${styles.left}`}
            aria-label="Scroll left"
            type="button"
            onClick={() => {
              const grid = document.querySelector(`.${styles.projectsGrid}`) as HTMLElement;
              if (grid) grid.scrollBy({ left: -650, behavior: 'smooth' });
            }}
          >
            &lt;
          </button>
          <div className={styles.projectsGrid}>
                        <div className={styles.projectCard}>
                          <div className={styles.projectImage} style={{backgroundImage: "url('/assets/portfolio.png')"}}>
                            <div className={styles.projectOverlay}></div>
                          </div>
                          <div className={styles.projectContent}>
                            <h3 className={styles.projectTitle}>Portfolio Website</h3>
                            <p className={styles.projectDescription}>A modern, interactive portfolio built with Next.js, TypeScript, and Framer Motion, featuring parallax effects and custom animations.</p>
                            <div className={styles.projectTags}>
                              <span className={styles.tag}>Next.js</span>
                              <span className={styles.tag}>TypeScript</span>
                              <span className={styles.tag}>Framer Motion</span>
                            </div>
                            <Link href="/about#projects" className={styles.projectButton}>
                              View Project →
                            </Link>
                          </div>
                        </div>
            <div className={styles.projectCard}>
              <div className={styles.projectImage} style={{backgroundImage: "url('/assets/fashion-index-hero.png')"}}>
                <div className={styles.projectOverlay}></div>
              </div>
              <div className={styles.projectContent}>
                <h3 className={styles.projectTitle}>Real Fashion Index</h3>
                <p className={styles.projectDescription}>Platform featuring SEO pages, faceted search, and modern UI patterns built with React, Node.js, and MongoDB.</p>
                <div className={styles.projectTags}>
                  <span className={styles.tag}>React</span>
                  <span className={styles.tag}>Node.js</span>
                  <span className={styles.tag}>MongoDB</span>
                </div>
                <Link href="/about#projects" className={styles.projectButton}>
                  View Project →
                </Link>
              </div>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.projectImage} style={{backgroundImage: "url('/assets/traceback-hero.png')"}}>
                <div className={styles.projectOverlay}></div>
              </div>
              <div className={styles.projectContent}>
                <h3 className={styles.projectTitle}>Traceback</h3>
                <p className={styles.projectDescription}>Campus lost & found application with ML-powered matching and real-time notifications using Next.js and PostgreSQL.</p>
                <div className={styles.projectTags}>
                  <span className={styles.tag}>Next.js</span>
                  <span className={styles.tag}>PostgreSQL</span>
                  <span className={styles.tag}>ML</span>
                </div>
                <Link href="/about#projects" className={styles.projectButton}>
                  View Project →
                </Link>
              </div>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.projectImage} style={{backgroundImage: "url('/assets/job-application-hero.png')"}}>
                <div className={styles.projectOverlay}></div>
              </div>
              <div className={styles.projectContent}>
                <h3 className={styles.projectTitle}>Job Application Tracker</h3>
                <p className={styles.projectDescription}>Track job applications with analytics dashboard and automated reminders built with TypeScript and MongoDB.</p>
                <div className={styles.projectTags}>
                  <span className={styles.tag}>TypeScript</span>
                  <span className={styles.tag}>React</span>
                  <span className={styles.tag}>MongoDB</span>
                </div>
                <Link href="/about#projects" className={styles.projectButton}>
                  View Project →
                </Link>
              </div>
            </div>
            <div className={styles.projectCard}>
              <div className={styles.projectImage} style={{backgroundImage: "url('/assets/task-hero.png')", backgroundSize: 'cover', backgroundPosition: 'bottom'}}>
                <div className={styles.projectOverlay}></div>
              </div>
              <div className={styles.projectContent}>
                <h3 className={styles.projectTitle}>Task Manager</h3>
                <p className={styles.projectDescription}>A collaborative task management platform that helps you organize personal tasks and seamlessly collaborate with team members on shared projects.</p>
                <div className={styles.projectTags}>
                  <span className={styles.tag}>React</span>
                  <span className={styles.tag}>Next.js</span>
                  <span className={styles.tag}>TypeScript</span>
                  <span className={styles.tag}>MySQL</span>
                </div>
                <Link href="/about#projects" className={styles.projectButton}>
                  View Project →
                </Link>
              </div>
            </div>
            <div className={styles.projectCard}>
              <div className={styles.projectImage} style={{backgroundImage: "url('/assets/portfolio-hero.png')"}}>
                <div className={styles.projectOverlay}></div>
              </div>
              <div className={styles.projectContent}>
                <h3 className={styles.projectTitle}>Portfolio Website</h3>
                <p className={styles.projectDescription}>A modern, interactive portfolio built with Next.js, TypeScript, and Framer Motion, featuring parallax effects and custom animations.</p>
                <div className={styles.projectTags}>
                  <span className={styles.tag}>Next.js</span>
                  <span className={styles.tag}>TypeScript</span>
                  <span className={styles.tag}>Framer Motion</span>
                </div>
                <Link href="/about#projects" className={styles.projectButton}>
                  View Project →
                </Link>
              </div>
            </div>
          </div>
          <button
            className={`${styles.carouselNavBtn} ${styles.right}`}
            aria-label="Scroll right"
            type="button"
            onClick={() => {
              const grid = document.querySelector(`.${styles.projectsGrid}`) as HTMLElement;
              if (grid) grid.scrollBy({ left: 650, behavior: 'smooth' });
            }}
          >
            &gt;
          </button>
        </section>


      </main>
      </div>
      {/* Contact section removed as requested */}
            {/* Let's Connect CTA */}
            {/* Reach Out CTA */}
            {/* Animated Reach Out CTA */}
            <div className={styles.reachOutCta}>
              <div className={styles.reachOutPrompt}>
                Want to know more? <a href="/about" className={styles.reachOutAboutLink}>Go to About section</a>
              </div>
              <a href="/contact" className={styles.animatedReachOut}>
                <span>Reach Out</span>
              </a>
            </div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Get In Touch</h3>
            <p className={styles.footerText}>Feel free to reach out for collaborations or just a friendly chat.</p>
          </div>
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Contact</h3>
            <ul className={styles.footerLinks}>
              <li>
                <a href="mailto:akshithachapalamadugu1024@gmail.com" className={styles.footerLink}>
                  akshithachapalamadugu1024@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+12342962036" className={styles.footerLink}>
                  +1 (234) 296 2036
                </a>
              </li>
              <li className={styles.footerLocation}>Kent, OH</li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Connect</h3>
            <ul className={styles.footerLinks}>
              <li>
                <a 
                  href="https://www.linkedin.com/in/akshitha-chapalamadugu-43055523a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Akshitha Chapalamadugu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
