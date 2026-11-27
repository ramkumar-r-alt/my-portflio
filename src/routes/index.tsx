import { createFileRoute } from "@tanstack/react-router";
import { currentRole, profile } from "@/lib/portfolio-data";
import { About } from "@/components/site/About";
import { Achievements } from "@/components/site/Achievements";
import { CursorFollower, Preloader, ScrollProgress } from "@/components/site/Chrome";
import { Contact, SiteFooter } from "@/components/site/Contact";
import { Experience } from "@/components/site/Experience";
import { Hero } from "@/components/site/Hero";
import { Projects } from "@/components/site/Projects";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkillsSphere } from "@/components/site/SkillsSphere";
import { TechStack } from "@/components/site/TechStack";
import { useLenis } from "@/components/site/useLenis";

const description =
  "Ramkumar R — Full Stack Engineer with 3+ years building enterprise-grade React, Next.js, Node.js, PostgreSQL and Redis products.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ramkumar R" },
      { name: "description", content: description },
      { property: "og:title", content: "Ramkumar R — Full Stack Engineer" },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: currentRole.title,
          worksFor: { "@type": "Organization", name: currentRole.company },
          description: profile.about,
          email: `mailto:${profile.email}`,
          sameAs: [profile.linkedin, profile.github],
          knowsAbout: ["React", "Next.js", "Supabase", "Node.js", "PostgreSQL", "Redis", "RabbitMQ"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <CursorFollower />
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Experience />
        <SkillsSphere />
        <Projects />
        <Achievements />
        <TechStack />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
