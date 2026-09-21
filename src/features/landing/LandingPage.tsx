import { BrandStory } from './BrandStory'
import { CTABanner } from './CTABanner'
import { Features } from './Features'
import { Hero } from './Hero'
import { HowItWorks } from './HowItWorks'
import { Showcase } from './Showcase'
import { Stats } from './Stats'
import { Testimonials } from './Testimonials'

export function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Showcase />
      <Features />
      <BrandStory />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  )
}