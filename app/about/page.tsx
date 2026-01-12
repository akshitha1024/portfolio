"use client";
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import type React from 'react'
import styles from './page.module.css'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [activeExp, setActiveExp] = useState<number | null>(null)
  const [hideHeader, setHideHeader] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [activeExperience, setActiveExperience] = useState(0)
  const [panelWave, setPanelWave] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const projectsViewportRef = useRef<HTMLDivElement>(null)
  const [projectOffsets, setProjectOffsets] = useState([0, 0, 0])
  const [projectScrollProgress, setProjectScrollProgress] = useState(0)
  const isScrollingRef = useRef(false)
  const totalProjects = 4

  const handlePanelMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const panel = panelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    panel.style.setProperty('--ripple-x', `${x}%`)
    panel.style.setProperty('--ripple-y', `${y}%`)
    panel.style.setProperty('--ripple-scale', '1')
  }

  const handlePanelLeave = () => {
    const panel = panelRef.current
    if (!panel) return
    panel.style.setProperty('--ripple-scale', '0.35')
  }

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }

    // Scroll to top and coordinate overlay animation phases
    window.scrollTo(0, 0)
    const totalMs = 2400
    const revealMs = 1800 // Content shows as rectangle begins scrolling up (75% of 2400ms)

    const revealTimer = setTimeout(() => {
      setShowContent(true)
    }, revealMs)

    const overlayTimer = setTimeout(() => {
      setShowOverlay(false)
    }, totalMs)

    return () => {
      clearTimeout(revealTimer)
      clearTimeout(overlayTimer)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset

      if (currentScroll <= 0) {
        setHideHeader(false)
        setLastScroll(currentScroll)
        return
      }

      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        setHideHeader(true)
      } else if (currentScroll < lastScroll) {
        // Scrolling up
        setHideHeader(false)
      }

      setLastScroll(currentScroll)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScroll])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          setVisibleCards((prev) => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }
      })
    }, { threshold: 0.2 })

    const cards = document.querySelectorAll('[data-index]')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const profileImg = document.querySelector(`.${styles.profileImageContainer}`) as HTMLElement
      if (profileImg) {
        const rect = profileImg.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePos({ x, y })

        // Update SVG filter based on mouse position
        const filter = document.querySelector('feDisplacementMap') as SVGFEDisplacementMapElement
        if (filter && x > 0 && y > 0 && x < rect.width && y < rect.height) {
          const scale = 25
          filter.setAttribute('scale', scale.toString())
        } else if (filter) {
          filter.setAttribute('scale', '0')
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const handleExperienceScroll = () => {
      const experienceItems = document.querySelectorAll('[data-experience-index]')
      if (experienceItems.length === 0) return
      
      const viewportCenter = window.innerHeight / 2
      let closestIndex = 0
      let smallestDistance = Infinity

      experienceItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect()
        const itemTop = rect.top
        const itemBottom = rect.bottom
        const itemCenter = itemTop + (itemBottom - itemTop) / 2
        
        // Distance from viewport center to item center
        const distance = Math.abs(viewportCenter - itemCenter)
        
        if (distance < smallestDistance) {
          smallestDistance = distance
          closestIndex = index
        }
      })

      console.log('Scroll detected, closest index:', closestIndex)
      setActiveExperience(closestIndex)
    }

    const scrollListener = () => {
      requestAnimationFrame(handleExperienceScroll)
    }

    window.addEventListener('scroll', scrollListener)
    handleExperienceScroll()
    
    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  const handleProjectsWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const scrollSensitivity = 0.003
    const delta = e.deltaY * scrollSensitivity

    setProjectScrollProgress((prev) => {
      const next = Math.max(0, Math.min(totalProjects - 1, prev + delta))
      return next
    })
  }, [totalProjects])

  // Update project offsets whenever scroll progress changes
  useEffect(() => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
    const newOffsets = Array.from({ length: totalProjects }).map((_, index) => {
      const relative = index - projectScrollProgress
      return relative * viewportWidth
    })

    setProjectOffsets(newOffsets)
  }, [projectScrollProgress, totalProjects])

  useEffect(() => {
    setPanelWave(true)
    const waveTimer = setTimeout(() => setPanelWave(false), 900)
    return () => {
      clearTimeout(waveTimer)
    }
  }, [activeExperience])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  if (!mounted) return null

  const projectScrollRatio = projectScrollProgress / Math.max(1, totalProjects - 1)

  return (
    <div className={styles.pageContainer}>
      {/* SVG filters */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="pixelate">
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="6" result="noise" seed="2" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      {/* Loading/Shrinking overlay that animates on load */}
      {showOverlay && (
        <div className={styles.loadingOverlay} />
      )}

      {/* Background gradient */}
      <div className={styles.bgGradient} />

      {/* Header */}
      <header className={`${styles.header} ${hideHeader ? styles.headerHidden : ''}`}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <Link href="/" className={styles.logo} aria-label="Go to home">
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
              href="/#about"
              className={styles.headerButton}
              aria-label="Go to About section"
            >
              About
            </Link>
            <Link href="/contact" className={styles.headerButton + ' ' + styles.headerButtonPrimary} aria-label="Go to contact page">
              Contact
            </Link>
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

      {/* Main content */}
      <main className={`${styles.aboutMain} ${showContent ? styles.contentVisible : ''}`}>
        <div className={styles.contentBox}>
          <h1 className={styles.aboutTitle}>ABOUT</h1>
          <div className={styles.aboutIntro}>
            <p>
              Hello! I’m Akshitha Chapalamadugu, a designer and developer passionate about building clean, intuitive, and high-performing digital experiences. I work across UI/UX, front-end, and back-end development, turning ideas into thoughtfully designed and well-engineered products.
            </p>
            <p>
              When I’m not designing interfaces or writing code, I enjoy exploring new design trends, refining my creative process, and experimenting with ideas that blend aesthetics with functionality.
            </p>
            <p>
              I’m always open to connecting with designers, developers, and teams who care about great design and meaningful technology. Feel free to reach out if you’d like to collaborate or just have a conversation.
            </p>
            <div className={styles.aboutActions}>
              <Link href="/contact" className={styles.reachLink} aria-label="Go to Contact page">Reach Out</Link>
            </div>
          </div>
        </div>
        <div className={styles.profileImageContainer}>
          <Image
            src="/assets/profile1.jpg"
            alt="Profile"
            width={400}
            height={600}
            className={styles.profileImage}
            priority
          />
        </div>
      </main>

      {/* Navigation Links Section */}
      <section className={styles.navLinksSection}>
        <Link href="#skills" className={styles.navLink}>Skills</Link>
        <Link href="#experience" className={styles.navLink}>Experience</Link>
        <Link href="#projects" className={styles.navLink}>Projects</Link>
      </section>

      {/* Skills Section */}
      <section id="skills" className={styles.skillsSection}>
        <h2 className={styles.sectionHeading}>SKILLS</h2>
        <div className={styles.skillsLayout}>
          {/* Left: Capabilities + Languages as lists */}
          <div className={styles.skillsLists}>
            <div className={styles.listsGrid}>
              <div>
                <h3 className={styles.categoryHeading}>Capabilities</h3>
                <ul className={styles.list}>
                  <li>Front-End Development</li>
                  <li>Back-End Development</li>
                  <li>Full-Stack Development</li>
                  <li>AI / Machine Learning</li>
                  <li>User Experience Design</li>
                  <li>Software Development</li>
                </ul>
              </div>
              <div>
                <h3 className={styles.categoryHeading}>Languages</h3>
                <ul className={styles.list}>
                  <li>Python</li>
                  <li>JavaScript</li>
                  <li>SQL</li>
                  <li>Java</li>
                  <li>HTML</li>
                  <li>CSS</li>
                </ul>
              </div>
              <div className={styles.listBlockWide}>
                <h3 className={styles.categoryHeading}>Libraries + Apps</h3>
                <ul className={styles.list}>
                  <li>React</li>
                  <li>Angular</li>
                  <li>Bootstrap</li>
                  <li>Flask</li>
                  <li>Django</li>
                  <li>Node.js</li>
                  <li>Next.js</li>
                  <li>TensorFlow</li>
                  <li>Scikit-learn</li>
                  <li>Power BI</li>
                  <li>Adobe</li>
                  <li>Figma</li>
                  <li>Canva</li>
                  <li>Git</li>
                  <li>PostgreSQL</li>
                  <li>MongoDB</li>
                  <li>MySQL</li>
                  <li>SQLite</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Scrolling outline badges in rows */}
          <div className={styles.skillsShowcase}>
            <div className={styles.marqueeRow}>
              <div className={styles.marqueeContent}>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>⚛️</span><span>React</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🅰️</span><span>Angular</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🅱️</span><span>Bootstrap</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🧪</span><span>Flask</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🎯</span><span>Django</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🟢</span><span>Node.js</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>▲</span><span>Next.js</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🐘</span><span>PostgreSQL</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🍃</span><span>MongoDB</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🐬</span><span>MySQL</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>💾</span><span>SQLite</span></div>
                {/* duplicate for seamless loop */}
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>⚛️</span><span>React</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🅰️</span><span>Angular</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🅱️</span><span>Bootstrap</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🧪</span><span>Flask</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🎯</span><span>Django</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🟢</span><span>Node.js</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>▲</span><span>Next.js</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🐘</span><span>PostgreSQL</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🍃</span><span>MongoDB</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🐬</span><span>MySQL</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>💾</span><span>SQLite</span></div>
              </div>
            </div>

            <div className={styles.marqueeRow}>
              <div className={styles.marqueeContent}>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🐍</span><span>Python</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>📜</span><span>JavaScript</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🌐</span><span>HTML</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🎨</span><span>CSS</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>📈</span><span>Power BI</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🎭</span><span>Adobe</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🎨</span><span>Figma</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🖼️</span><span>Canva</span></div>
                {/* duplicate */}
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🐍</span><span>Python</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>📜</span><span>JavaScript</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🌐</span><span>HTML</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🎨</span><span>CSS</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>📈</span><span>Power BI</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🎭</span><span>Adobe</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🎨</span><span>Figma</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🖼️</span><span>Canva</span></div>
              </div>
            </div>

            <div className={styles.marqueeRow}>
              <div className={styles.marqueeContent}>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🧠</span><span>TensorFlow</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>📊</span><span>Scikit-learn</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🔀</span><span>Git</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🗄️</span><span>SQL</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🏗️</span><span>OOP</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🤝</span><span>Teamwork</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🧩</span><span>Problem Solving</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>💬</span><span>Communication</span></div>
                {/* duplicate */}
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🧠</span><span>TensorFlow</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>📊</span><span>Scikit-learn</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🔀</span><span>Git</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🗄️</span><span>SQL</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🏗️</span><span>OOP</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🤝</span><span>Teamwork</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>🧩</span><span>Problem Solving</span></div>
                <div className={styles.skillBadgeItem}><span className={styles.skillIcon}>💬</span><span>Communication</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className={styles.experienceSection}>
        <h2 className={styles.sectionHeading}>EXPERIENCE</h2>
        <div className={styles.experienceTimelineWrapper}>
          {/* Timeline */}
          <div className={styles.experienceTimeline}>
            {/* Experience 1 */}
            <div 
              className={`${styles.experienceItem} ${activeExperience === 0 ? styles.active : styles.inactive}`} 
              data-experience-index="0"
              onClick={() => setActiveExperience(0)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.experienceMarker}></div>
              <div className={styles.experienceContent}>
                <p className={styles.experienceDates}>Sep 2025 - Dec 2025</p>
                <p className={styles.experienceCompany}>Real Fashion Index</p>
              </div>
              <div 
                className={styles.experienceLogo}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveExperience(0)
                }}
              >
                <Image 
                  src="/assets/real_fashion_index_logo.jpg" 
                  alt="Real Fashion Index" 
                  width={120} 
                  height={120}
                  className={styles.logoImage}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Experience 2 */}
            <div 
              className={`${styles.experienceItem} ${activeExperience === 1 ? styles.active : styles.inactive}`} 
              data-experience-index="1"
              onClick={() => setActiveExperience(1)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.experienceMarker}></div>
              <div className={styles.experienceContent}>
                <p className={styles.experienceDates}>Jan 2025 - May 2025</p>
                <p className={styles.experienceCompany}>Kent State University</p>
              </div>
              <div 
                className={styles.experienceLogo}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveExperience(1)
                }}
              >
                <Image 
                  src="/assets/kentstateunniversitylogo.jpg" 
                  alt="Kent State University" 
                  width={120} 
                  height={120}
                  className={styles.logoImage}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Experience 3 */}
            <div 
              className={`${styles.experienceItem} ${activeExperience === 2 ? styles.active : styles.inactive}`} 
              data-experience-index="2"
              onClick={() => setActiveExperience(2)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.experienceMarker}></div>
              <div className={styles.experienceContent}>
                <p className={styles.experienceDates}>Apr 2024 - Jun 2024</p>
                <p className={styles.experienceCompany}>Plasmid</p>
              </div>
              <div 
                className={styles.experienceLogo}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveExperience(2)
                }}
              >
                <Image 
                  src="/assets/plasmidlogo.jpg" 
                  alt="Plasmid" 
                  width={120} 
                  height={120}
                  className={styles.logoImage}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div
            ref={panelRef}
            className={`${styles.experienceSidePanel} ${panelWave ? styles.panelWave : ''}`}
            data-active-company={activeExperience}
            onMouseMove={handlePanelMove}
            onMouseEnter={handlePanelMove}
            onMouseLeave={handlePanelLeave}
          >
            <div className={`${styles.panelContent} ${panelWave ? styles.panelReveal : ''}`}>
              <div className={`${styles.detailCard} ${activeExperience === 0 ? styles.detailActive : ''}`}>
                <div>
                  <div className={styles.detailHeader}>
                    <div className={styles.detailHeaderText}>
                      <h3 className={styles.detailTitle}>Real Fashion Index</h3>
                      <p className={styles.detailRole}>Full Stack Developer Intern</p>
                      <p className={styles.detailDates}>Sep 2025 - Dec 2025 · 4 mos</p>
                    </div>
                  </div>
                  <div className={styles.detailDivider}></div>
                  <ul className={styles.detailList}>
                    <li>Assisted in developing and maintaining web application features using Next.JS, JavaScript, MongoDB, and React.</li>
                    <li>Collaborated with team members to understand requirements and deliver solutions.</li>
                    <li>Debugged issues and improved code maintainability.</li>
                    <li>Used Git for version control and followed structured development workflows.</li>
                    <li>Collaborated with engineers and product stakeholders to deliver scalable solutions aligned with business needs.</li>
                  </ul>
                  <div className={styles.detailDivider}></div>
                  <div className={styles.detailSkills}>
                    <span>React.js</span>
                    <span>Next.js</span>
                    <span>MongoDB</span>
                    <span>Git</span>
                    <span>Java</span>
                  </div>
                </div>
                <div className={styles.detailLogoWrapper}>
                  <Image 
                    src="/assets/real_fashion_index_logo.jpg" 
                    alt="Real Fashion Index" 
                    width={280} 
                    height={280}
                    className={styles.detailLogo}
                  />
                </div>
              </div>
              <div className={`${styles.detailCard} ${activeExperience === 1 ? styles.detailActive : ''}`}>
                <div>
                  <div className={styles.detailHeader}>
                    <div className={styles.detailHeaderText}>
                      <h3 className={styles.detailTitle}>Kent State University</h3>
                      <p className={styles.detailRole}>Software Developer</p>
                      <p className={styles.detailDates}>Jan 2025 - May 2025 · 5 mos</p>
                    </div>
                  </div>
                  <div className={styles.detailDivider}></div>
                  <ul className={styles.detailList}>
                    <li>Worked as a Software Developer on a university-based initiative during the second semester, focusing on backend and full-stack development.</li>
                    <li>Designed and implemented application logic and RESTful services using Python, JavaScript, and SQL following Software Development Lifecycle (SDLC) practices.</li>
                    <li>Developed and optimized database-backed features, improving query performance and data reliability.</li>
                    <li>Debugged and resolved functional and performance issues through testing and iterative improvements.</li>
                    <li>Collaborated with peers in a team-based development environment, participating in code reviews and feature planning.</li>
                  </ul>
                  <div className={styles.detailDivider}></div>
                  <div className={styles.detailSkills}>
                    <span>Python</span>
                    <span>JavaScript</span>
                    <span>SQL</span>
                    <span>RESTful WebServices</span>
                    <span>SDLC</span>
                  </div>
                </div>
                <div className={styles.detailLogoWrapper}>
                  <Image 
                    src="/assets/kentstateunniversitylogo.jpg" 
                    alt="Kent State University" 
                    width={280} 
                    height={280}
                    className={styles.detailLogo}
                  />
                </div>
              </div>
              <div className={`${styles.detailCard} ${activeExperience === 2 ? styles.detailActive : ''}`}>
                <div>
                  <div className={styles.detailHeader}>
                    <div className={styles.detailHeaderText}>
                      <h3 className={styles.detailTitle}>Plasmid</h3>
                      <p className={styles.detailRole}>Web Developer</p>
                      <p className={styles.detailDates}>Apr 2024 - Jun 2024 · 3 mos</p>
                    </div>
                  </div>
                  <div className={styles.detailDivider}></div>
                  <ul className={styles.detailList}>
                    <li>Assisted in developing and supporting web-based IT systems using Python and JavaScript.</li>
                    <li>Contributed to application troubleshooting and bug fixes, improving overall system usability.</li>
                    <li>Collaborated with team members to implement features while adapting quickly to new tools and technologies.</li>
                  </ul>
                  <div className={styles.detailDivider}></div>
                  <div className={styles.detailSkills}>
                    <span>Python</span>
                    <span>JavaScript</span>
                    <span>Web Development</span>
                  </div>
                </div>
                <div className={styles.detailLogoWrapper}>
                  <Image 
                    src="/assets/plasmidlogo.jpg" 
                    alt="Plasmid" 
                    width={280} 
                    height={280}
                    className={styles.detailLogo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section with Horizontal Scroll Effect */}
      <section id="projects" ref={projectsRef} className={styles.projectsSection}>
        <h2 className={styles.sectionHeading}>PROJECTS</h2>
        <div className={styles.projectsViewport} ref={projectsViewportRef} onWheel={handleProjectsWheel}>
          <div
            className={`${styles.projectCard} ${styles.projectCardHero}`}
            style={{
              transform: `translateX(${projectOffsets[0]}px)`,
              backgroundImage: "linear-gradient(rgba(18, 10, 14, 0.65), rgba(18, 10, 14, 0.65)), url('/assets/fashion-index-hero.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className={styles.projectContent}>
              <h3 className={styles.projectTitle}>Real Fashion Index Platform</h3>
              <p className={styles.projectDescription}>
                Responsible for creating and enhancing platform webpages, adding new pages, and improving search and discovery experiences across the site.
              </p>
              <ul className={styles.projectBullets}>
                <li>Launched SEO-friendly landing and content pages that lifted organic visibility.</li>
                <li>Implemented faceted search and relevance tuning to surface fashion insights faster.</li>
                <li>Built reusable UI patterns to accelerate new page creation and keep design consistent.</li>
              </ul>
              <div className={styles.projectTechs}>
                <span>React</span>
                <span>Node.js</span>
                <span>MongoDB</span>
              </div>
              <a 
                href="https://www.fashionindex.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.projectButton}
              >
                Visit Website →
              </a>
            </div>
          </div>
          
          <div 
            className={`${styles.projectCard} ${styles.projectCardHero}`}
            style={{ 
              transform: `translateX(${projectOffsets[1]}px)`,
              backgroundImage: "linear-gradient(rgba(18, 10, 14, 0.65), rgba(18, 10, 14, 0.65)), url('/assets/traceback-hero.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'top',
            }}
          >
            <div className={styles.projectContent}>
              <h3 className={styles.projectTitle}>Traceback</h3>
              <p className={styles.projectDescription}>
                A campus community lost and found platform designed for Kent State students featuring automatic matching between lost and found items using machine learning algorithms.
              </p>
              <ul className={styles.projectBullets}>
                <li>Intelligent ML-powered matching automatically connects lost items with found items based on descriptions and attributes.</li>
                <li>Real-time notifications alert users instantly when potential matches are found, speeding up recovery.</li>
                <li>Secure authentication and verification system ensures only verified students can post and claim items.</li>
              </ul>
              <div className={styles.projectTechs}>
                <span>React</span>
                <span>Next.js</span>
                <span>PostgreSQL</span>
                <span>Machine Learning</span>
              </div>
              <a 
                href="https://traceback-one.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.projectButton}
              >
                Visit Website →
              </a>
            </div>
          </div>

          
          <div 
            className={`${styles.projectCard} ${styles.projectCardHero}`}
            style={{ 
              transform: `translateX(${projectOffsets[2]}px)`,
              backgroundImage: "linear-gradient(rgba(18, 10, 14, 0.65), rgba(18, 10, 14, 0.65)), url('/assets/job-application-hero.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'top',
            }}
          >
            <div className={styles.projectContent}>
              <h3 className={styles.projectTitle}>Job Application Tracker</h3>
              <p className={styles.projectDescription}>
                A comprehensive platform to streamline your job search process by tracking applications, managing deadlines, and monitoring application statuses all in one place.
              </p>
              <ul className={styles.projectBullets}>
                <li>Track unlimited job applications with company details, positions, and application dates.</li>
                <li>Visual analytics dashboard showing application trends, response rates, and success metrics.</li>
                <li>Automated reminders for follow-ups and upcoming interviews to stay organized.</li>
              </ul>
              <div className={styles.projectTechs}>
                <span>React</span>
                <span>TypeScript</span>
                <span>Node.js</span>
                <span>MongoDB</span>
              </div>
              <a 
                href="https://jobtracker-app.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.projectButton}
              >
                Visit Website →
              </a>
            </div>
          </div>

          <div 
            className={`${styles.projectCard} ${styles.projectCardHero}`}
            style={{ 
              transform: `translateX(${projectOffsets[3]}px)`,
              backgroundImage: "linear-gradient(rgba(18, 10, 14, 0.65), rgba(18, 10, 14, 0.65)), url('/assets/task-hero.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
            }}
          >
            <div className={styles.projectContent}>
              <h3 className={styles.projectTitle}>Task Manager</h3>
              <p className={styles.projectDescription}>
                A collaborative task management platform that helps you organize personal tasks and seamlessly collaborate with team members on shared projects.
              </p>
              <ul className={styles.projectBullets}>
                <li>Create and organize tasks with priorities, due dates, and custom categories for better productivity.</li>
                <li>Real-time collaboration features allowing teams to assign tasks, share updates, and track progress together.</li>
                <li>Visual boards and timelines provide clear overview of project status and upcoming deadlines.</li>
              </ul>
              <div className={styles.projectTechs}>
                <span>React</span>
                <span>Next.js</span>
                <span>TypeScript</span>
                <span>MySQL</span>
              </div>
              <a 
                href="https://taskmanager-collab.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.projectButton}
              >
                Visit Website →
              </a>
            </div>
          </div>

          <div className={styles.projectsScrollTrack}>
            <div
              className={styles.projectsScrollThumb}
              style={{ transform: `translateY(${Math.max(0, Math.min(80, projectScrollRatio * 80))}%)` }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
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
