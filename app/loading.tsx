'use client'

import Image from 'next/image'

export default function Loading() {
  return (
    <div className="loading-overlay" role="status" aria-label="Loading page">
      <div className="loading-wrapper">
        <div className="loading-character">
          <Image
            src="/assets/stitch1.png"
            alt="Loading"
            width={150}
            height={150}
            priority
          />
        </div>
        <div className="loading-track">
          <div className="loading-bar" />
        </div>
      </div>
    </div>
  )
}