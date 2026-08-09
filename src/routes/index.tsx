import { createFileRoute } from "@tanstack/react-router";
import { profile } from "@/lib/portfolio-data";
import { About } from "@/components/site/About";
import { Achievements } from "@/components/site/Achievements";
import { CursorFollower, Preloader, ScrollProgress, SectionDots } from "@/components/site/Chrome";
import { Contact, SiteFooter } from "@/components/site/Contact";
import { Experience } from "@/components/site/Experience";
import { Hero } from "@/components/site/Hero";
import { Projects } from "@/components/site/Projects";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkillsOrbit } from "@/components/site/SkillsOrbit";
import { TechStack } from "@/components/site/TechStack";
import { useLenis } from "@/components/site/useLenis";

const description =
  "Ramkumar R — Full Stack Engineer with 3+ years building enterprise-grade React, Next.js, Node.js, PostgreSQL and Redis products.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ramkumar R — Full Stack Engineer Portfolio" },
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
          jobTitle: profile.title,
          description: profile.about,
          email: `mailto:${profile.email}`,
          sameAs: [profile.linkedin, profile.github],
          knowsAbout: ["React", "Next.js", "Node.js", "PostgreSQL", "Redis", "RabbitMQ"],
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
      <SectionDots />
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Experience />
        <SkillsOrbit />
        <Projects />
        <Achievements />
        <TechStack />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
