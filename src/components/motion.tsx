"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo("[data-enter]", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.11, ease: "power3.out", clearProps: "all" });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.85, ease: "power3.out", clearProps: "all",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.fromTo(element, { yPercent: -3 }, {
          yPercent: 3, ease: "none", scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: 0.7 },
        });
      });
    });
    return () => mm.revert();
  }, [pathname]);
  return null;
}
