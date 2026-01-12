import Image from 'next/image'
import Link from 'next/link'

export default function FeaturedProjectCard() {
  return (
    <div className="projectCard">
      <div className="projectImage" style={{backgroundImage: "url('/assets/portfolio-hero.png')"}}>
        <div className="projectOverlay"></div>
      </div>
      <div className="projectContent">
        <h3 className="projectTitle">Portfolio Website</h3>
        <p className="projectDescription">A modern, interactive portfolio built with Next.js, TypeScript, and Framer Motion, featuring parallax effects and custom animations.</p>
        <div className="projectTags">
          <span className="tag">Next.js</span>
          <span className="tag">TypeScript</span>
          <span className="tag">Framer Motion</span>
        </div>
        <Link href="/about#projects" className="projectButton">
          View Project →
        </Link>
      </div>
    </div>
  )
}
