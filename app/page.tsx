import { HeroSlider } from '@/components/hero-slider'
import { ActionSection } from '@/components/action-section'
import { VisitorCounter } from '@/components/visitor-counter'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSlider />
      <ActionSection />
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-muted/30">
        <div className="max-w-md mx-auto">
          <VisitorCounter />
        </div>
      </div>
      <div className="flex-1" />
      <Footer />
    </main>
  )
}
