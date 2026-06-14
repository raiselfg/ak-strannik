import { Suspense } from "react";
import { Hero } from "@/components/hero";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const TeamSection = dynamic(() => import("@/components/team-section"));
const Achievements = dynamic(() => import("@/components/achievements"));
const ProjectsSection = dynamic(() => import("@/components/projects-section"));

export const metadata: Metadata = {
  title: "Академия Странствий — Творческая мастерская",
  description:
    "Академия Странствий — это корабль, путешествующий по вашим мечтам. Сохранение русской культурной идентичности, поддержание творчества и таланта.",
  openGraph: {
    title: "Академия Странствий",
    description: "Творческая мастерская: фестивали, спектакли, мастер-классы.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <TeamSection />
      </Suspense>
      <Suspense fallback={null}>
        <Achievements />
      </Suspense>
      <Suspense fallback={null}>
        <ProjectsSection />
      </Suspense>
    </>
  );
}
