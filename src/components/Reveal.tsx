/**
 * The only motion on the site: elements with the `reveal` class fade up
 * gently the first time they scroll into view.
 *
 * Uses the browser's IntersectionObserver instead of scroll-position maths,
 * so it keeps working when the page grows (images loading, forms opening).
 * Anything already above the viewport - e.g. after jumping to a section from
 * the menu - is shown immediately, so content can never stay hidden. Skipped
 * entirely when the visitor's device asks for reduced motion.
 */
import { useEffect, type RefObject } from 'react'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useReveal(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current
    if (!root || prefersReducedMotion() || !('IntersectionObserver' in window)) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    items.forEach((el) => el.classList.add('reveal-init'))

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            e.target.classList.add('reveal-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      items.forEach((el) => el.classList.remove('reveal-init', 'reveal-in'))
    }
  }, [scope])
}
