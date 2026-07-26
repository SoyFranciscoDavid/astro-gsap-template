import { gsap } from "@scripts/gsap";

export function initHeroAnimation() {
  const container = document.querySelector("[data-hero-container]");
  if (!container) return;

  const badge = container.querySelector("[data-hero-badge]");
  const title = container.querySelector("[data-hero-title]");
  const subtitle = container.querySelector("[data-hero-subtitle]");
  const cta = container.querySelector("[data-hero-cta]");

  const elements = [badge, title, subtitle, cta].filter(Boolean);
  if (elements.length === 0) return;

  // Make elements visible so GSAP can animate them
  gsap.set(elements, { visibility: "visible", opacity: 1 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });

  if (badge) {
    tl.from(badge, { y: -20, opacity: 0 });
  }
  if (title) {
    tl.from(title, { y: 40, opacity: 0 }, "-=0.6");
  }
  if (subtitle) {
    tl.from(subtitle, { y: 20, opacity: 0 }, "-=0.6");
  }
  if (cta) {
    tl.from(cta, { y: 20, opacity: 0 }, "-=0.4");
  }
}
