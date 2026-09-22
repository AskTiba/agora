import { useEffect } from 'react'

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale'

export function useScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('revealed', entry.isIntersecting)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    const reveal = (el: HTMLElement) => {
      if (reduced) el.classList.add('revealed')
      else observer.observe(el)
    }

    document.querySelectorAll<HTMLElement>(SELECTOR).forEach(reveal)

    if (!reduced) {
      const mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue
            if (node.matches(SELECTOR)) reveal(node)
            node.querySelectorAll<HTMLElement>(SELECTOR).forEach(reveal)
          }
        }
      })
      mutationObserver.observe(document.body, { childList: true, subtree: true })

      return () => {
        observer.disconnect()
        mutationObserver.disconnect()
      }
    }

    return () => observer.disconnect()
  }, [])
}