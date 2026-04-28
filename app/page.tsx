import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Manifesto } from "@/components/manifesto"
import { WhyGaussia } from "@/components/why-gaussia"
import { Contract } from "@/components/contract"
import { HowItWorks } from "@/components/how-it-works"
import { Modules } from "@/components/modules"
import { GetStarted } from "@/components/get-started"
import { Contribute } from "@/components/contribute"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <Hero />
        <Manifesto />
        <WhyGaussia />
        <Contract />
        <HowItWorks />
        <Modules />
        <GetStarted />
        <Contribute />
      </main>
      <SiteFooter />
    </div>
  )
}
