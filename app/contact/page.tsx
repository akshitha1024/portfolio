'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function ContactPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [showContent, setShowContent] = useState(false)

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
    const revealMs = 1800

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  if (!mounted) return null

  return (
    <div style={containerStyle}>
      {/* Loading/Shrinking overlay that animates on load */}
      {showOverlay && (
        <div style={loadingOverlayStyle} />
      )}

      {/* Header */}
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={logoSectionStyle}>
            <Link 
              href="/" 
              style={logoLinkStyle}
            >
              <Image
                src="/assets/logo.png?v=2"
                alt="Logo"
                width={100}
                height={60}
              />
            </Link>
            <span style={nameTextStyle}>AKSHITHA CHAPALAMADUGU</span>
          </div>
          <div style={headerActionsStyle}>
            <Link
              href="/#about"
              style={headerButtonStyle}
            >
              About
            </Link>
            <Link href="/contact" style={{...headerButtonStyle, ...headerButtonPrimaryStyle}}>
              Contact
            </Link>
            <button 
              style={themeToggleStyle}
              onClick={toggleTheme}
            >
              {theme === 'light' ? '🌙' : '🌞'}
            </button>
          </div>
        </div>
      </header>

      {/* Contact Section */}
      <main style={mainStyle}>
        <div style={contactWrapperStyle}>
          <div style={contactLeftStyle}>
            <h1 style={contactTitleStyle}>
              Let's<br />Connect
            </h1>
          </div>

          <div style={contactRightStyle}>
            <div style={contactInfoStyle}>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
                <span style={emojiStyle}>📧</span>
                <div style={{...infoBlockStyle, animationDelay: '0.3s', flex: 1}}>
                  <h3 style={{...infoLabelStyle, marginTop: 0}}>Email</h3>
                <a 
                  href="mailto:akshithachapalamadugu1024@gmail.com" 
                  style={infoValueStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-color)'
                    e.currentTarget.style.transform = 'translateX(10px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  akshithachapalamadugu1024@gmail.com
                </a>
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
                <span style={emojiStyle}>📱</span>
                <div style={{...infoBlockStyle, animationDelay: '0.6s', flex: 1}}>
                  <h3 style={{...infoLabelStyle, marginTop: 0}}>Phone</h3>
                <a 
                  href="tel:+12342962036" 
                  style={infoValueStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-color)'
                    e.currentTarget.style.transform = 'translateX(10px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  +1 (234) 296 2036
                </a>
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
                <span style={emojiStyle}>📍</span>
                <div style={{...infoBlockStyle, animationDelay: '0.9s', flex: 1}}>
                  <h3 style={{...infoLabelStyle, marginTop: 0}}>Location</h3>
                <p style={{...infoValueStyle, margin: 0}}>Kent, OH</p>
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
                <span style={emojiStyle}>💼</span>
                <div style={{...infoBlockStyle, animationDelay: '1.2s', flex: 1}}>
                  <h3 style={{...infoLabelStyle, marginTop: 0}}>LinkedIn</h3>
                <a 
                  href="https://www.linkedin.com/in/akshitha-chapalamadugu-43055523a" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={infoValueStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-color)'
                    e.currentTarget.style.transform = 'translateX(10px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  Connect on LinkedIn →
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={footerStyle}>
        <p style={footerTextStyle}>© {new Date().getFullYear()} Akshitha Chapalamadugu. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Inline styles
const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  position: 'relative',
}

const loadingOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: '50%',
  transform: 'translate(-50%, -100%)',
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(135deg, #4a1a3f 0%, #7d2d4a 50%, #a03a52 100%)',
  zIndex: 100,
  pointerEvents: 'none',
  animation: 'scrollShrinkRevealReturn 2400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
}

const headerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  background: 'transparent',
  borderBottom: 'none',
  zIndex: 200,
  backdropFilter: 'none',
  boxShadow: 'none',
  transform: 'translateY(0)',
  transition: 'transform 0.3s ease',
}

const headerContentStyle: React.CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '1rem 2rem 1rem 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const logoSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}

const logoLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  padding: '0.25rem',
  borderRadius: '8px',
  textDecoration: 'none',
}

const nameTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-limelight)',
  fontSize: '1.8rem',
  fontWeight: 400,
  color: 'var(--text-primary)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

const headerActionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
}

const headerButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '40px',
  padding: '0 1rem',
  border: '1px solid var(--border-color)',
  borderRadius: '999px',
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  background: 'transparent',
  transition: 'all 0.25s ease',
  cursor: 'pointer',
}

const headerButtonPrimaryStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, var(--primary-color), #ff6b9d)',
  color: '#fff',
  borderColor: 'transparent',
}

const themeToggleStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--border-color)',
  width: '120px',
  height: '80px',
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.5rem',
  transition: 'all 0.3s ease',
  color: 'var(--text-primary)',
}

const mainStyle: React.CSSProperties = {
  padding: '8rem 2rem 4rem',
  minHeight: 'calc(100vh - 120px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const contactWrapperStyle: React.CSSProperties = {
  maxWidth: '1400px',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1.2fr',
  gap: '4rem',
  alignItems: 'center',
}

const contactLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
}

const contactTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-limelight)',
  fontSize: '11rem',
  fontWeight: 400,
  margin: 0,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '0.9',
}

const contactRightStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

const contactInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
}

const infoBlockStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  animation: 'slideInRight 1.5s ease-out forwards',
  opacity: 0,
}

const emojiStyle: React.CSSProperties = {
  fontSize: '3rem',
  display: 'inline-block',
  animation: 'bounce 2s ease-in-out infinite',
  flexShrink: 0,
}

const infoLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-libre)',
  fontSize: '4rem',
  fontWeight: 700,
  color: 'var(--primary-color)',
  margin: '0 0 1rem 0',
  background: 'linear-gradient(135deg, var(--primary-color), #14b8a6)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1.2',
}

const infoValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-libre)',
  fontSize: '1.8rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  wordBreak: 'break-word',
  lineHeight: '1.4',
  margin: 0,
}

const footerStyle: React.CSSProperties = {
  background: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border-subtle)',
  padding: '2rem',
  textAlign: 'center',
}

const footerTextStyle: React.CSSProperties = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
}
