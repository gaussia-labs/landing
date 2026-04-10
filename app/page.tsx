import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { MotivationSection } from "@/components/motivation-section"
import { MetricsSection } from "@/components/metrics-section"
import { EnvironmentsSection } from "@/components/environments-section"
import { RoadmapSection } from "@/components/roadmap-section"
import { WhyNowSection } from "@/components/why-now-section"
import { CommunitySection } from "@/components/community-section"
import { CodeExampleSection } from "@/components/code-example-section"
import { Footer } from "@/components/footer"

export default function GaussiaLanding() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <HeroSection />
        <ProblemSection />
        <MotivationSection />
        <MetricsSection />
        <EnvironmentsSection />
        <CodeExampleSection />
        <RoadmapSection />
        <WhyNowSection />
        <CommunitySection />
        <Footer />
      </main>
    </>
  )
}
