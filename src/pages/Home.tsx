/**
 * Home page: hero -> highlights -> services -> about -> team -> first visit
 * -> reviews -> FAQ -> appointment form -> closing banner.
 */
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import Booking from '@/components/Booking'
import Hero from '@/components/Hero'
import { useReveal } from '@/components/Reveal'
import { About, CtaBand, Faq, FirstVisit, Highlights, Services, Team, Testimonials } from '@/components/Sections'

export default function Home() {
  const { hash } = useLocation()
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  // Arriving from another page with /#section: scroll there once laid out.
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }, 120)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <main ref={root}>
      <Hero />
      <Highlights />
      <Services />
      <About />
      <Team />
      <FirstVisit />
      <Testimonials />
      <Faq />
      <Booking />
      <CtaBand />
    </main>
  )
}
