import { Achievements } from "@/components/achievements"
import { ContactsSection } from "@/components/contacts-section"
import { Hero } from "@/components/hero"
import { ProjectsSection } from "@/components/projects-section"
import { SiteHeader } from "@/components/site-header"
import { TeamSection } from "@/components/team-section"

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TeamSection />
        <Achievements />
        <ProjectsSection />
        <ContactsSection />
      </main>
    </>
  )
}
