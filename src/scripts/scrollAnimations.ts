import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animaciones de scroll típicas de landing: reveal (fade-up con stagger),
 * parallax (scrub) y burst (explosión revertida: los items parten
 * desordenados/dispersos y se acomodan al llegar el scroll).
 *
 * Uso (atributos HTML):
 *  - `data-reveal`                → contenedor: anima sus HIJOS directos con stagger.
 *  - `data-reveal="self"`         → anima el elemento en sí (no los hijos).
 *  - `data-reveal-static` (hijo)  → ese hijo solo hace fade de opacidad, sin
 *                                   movimiento (útil si su posición se mide
 *                                   en otro lado, ej. el slot del mate journey).
 *  - `data-parallax="8"`          → el número (opcional) es el yPercent máximo.
 *  - `data-burst`                 → contenedor: sus hijos directos parten con
 *                                   x/y/rotación aleatorios y se ordenan.
 *
 * Todo se puede reconfigurar pasando un objeto parcial (DeepPartial).
 */

export interface ScrollAnimationsConfig {
  selectors: {
    reveal: string;
    parallax: string;
    burst: string;
  };
  reveal: {
    /** px de desplazamiento vertical del fade-up. */
    y: number;
    duration: number;
    stagger: number;
    ease: string;
    /** Posición del trigger: el reveal dispara cuando el elemento cruza esto. */
    start: string;
    /** Solo aparece una vez (no se revierte al volver a scrollear arriba). */
    once: boolean;
  };
  parallax: {
    /** yPercent máximo: el elemento va de -yPercent a +yPercent con scrub. */
    yPercent: number;
    start: string;
    end: string;
  };
  burst: {
    /** Rango de dispersión horizontal (px), ±. */
    xRange: number;
    /** Rango de dispersión vertical (px), ±. */
    yRange: number;
    /** Rango de rotación inicial (grados), ±. */
    rotRange: number;
    /** Escala inicial (los items "nacen" chiquitos). */
    scale: number;
    duration: number;
    stagger: number;
    ease: string;
    start: string;
    once: boolean;
  };
}

const DEFAULTS: ScrollAnimationsConfig = {
  selectors: {
    reveal: "[data-reveal]",
    parallax: "[data-parallax]",
    burst: "[data-burst]",
  },
  reveal: {
    y: 44,
    duration: 0.9,
    stagger: 0.09,
    ease: "power3.out",
    start: "top 85%",
    once: true,
  },
  parallax: {
    yPercent: 12,
    start: "top bottom",
    end: "bottom top",
  },
  burst: {
    xRange: 70,
    yRange: 60,
    rotRange: 15,
    scale: 0.55,
    duration: 1,
    stagger: 0.07,
    ease: "back.out(1.4)",
    start: "top 80%",
    once: true,
  },
};

/** Permite sobreescribir solo los campos que se quieran ajustar. */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function mergeConfig(
  overrides: DeepPartial<ScrollAnimationsConfig> = {},
): ScrollAnimationsConfig {
  return {
    ...DEFAULTS,
    ...overrides,
    selectors: { ...DEFAULTS.selectors, ...overrides.selectors },
    reveal: { ...DEFAULTS.reveal, ...overrides.reveal },
    parallax: { ...DEFAULTS.parallax, ...overrides.parallax },
    burst: { ...DEFAULTS.burst, ...overrides.burst },
  };
}

/** Hijos directos que sean elementos visibles (descarta texto/vacíos). */
function visibleChildren(el: Element): HTMLElement[] {
  return [...el.children].filter(
    (c): c is HTMLElement => c instanceof HTMLElement,
  );
}

/**
 * Inicia todas las animaciones de scroll. Devuelve el matchMedia para
 * poder `revert()` si hiciera falta.
 */
export function initScrollAnimations(
  overrides: DeepPartial<ScrollAnimationsConfig> = {},
) {
  const cfg = mergeConfig(overrides);
  const mm = gsap.matchMedia();

  mm.add("(min-width: 0px)", () => {
    // ---------- REVEAL (fade-up) ----------
    const reveals = document.querySelectorAll(cfg.selectors.reveal);
    reveals.forEach((container) => {
      const el = container as HTMLElement;
      const mode = el.dataset.reveal; // undefined | "self"
      const children = visibleChildren(el);
      const targets =
        mode === "self" || children.length === 0 ? [el] : children;

      const isStatic = (t: HTMLElement) => t.hasAttribute("data-reveal-static");

      // IMPORTANTE: patrón `set` + `to` (NO `from`/`fromTo` con once).
      // Los tweens `from`/`fromTo` se REVIERTEN cuando ScrollTrigger con
      // `once: true` mata el tween al completar, dejando la opacidad
      // atascada en el estado inicial (bug: cards invisibles para siempre).
      // Con `set` (estado inicial) + `to` (animación) el final queda
      // clavado y no hay reversión posible.
      gsap.set(targets, {
        y: (i: number, t: Element) =>
          isStatic(t as HTMLElement) ? 0 : cfg.reveal.y,
        autoAlpha: 0,
      });

      gsap.to(targets, {
        y: 0,
        autoAlpha: 1,
        duration: cfg.reveal.duration,
        ease: cfg.reveal.ease,
        stagger: cfg.reveal.stagger,
        scrollTrigger: {
          trigger: el,
          // Se puede sobreescribir por elemento con `data-reveal-start`.
          // Necesario para el último elemento de la página (p. ej. la barra
          // final del footer): con "top 85%" su trigger nunca se dispara y
          // queda invisible para siempre + desplazado (espacio en blanco).
          start: el.dataset.revealStart || cfg.reveal.start,
          once: cfg.reveal.once,
        },
        // Deja el elemento en su CSS natural (permite hovers con transform)
        onComplete: () => gsap.set(targets, { clearProps: "transform" }),
      });
    });

    // ---------- PARALLAX (scrub) ----------
    const parallaxes = document.querySelectorAll(cfg.selectors.parallax);
    parallaxes.forEach((el) => {
      const speed = Number(
        (el as HTMLElement).dataset.parallax || cfg.parallax.yPercent,
      );
      gsap.fromTo(
        el,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: cfg.parallax.start,
            end: cfg.parallax.end,
            scrub: true,
          },
        },
      );
    });

    // ---------- BURST (explosión revertida) ----------
    const bursts = document.querySelectorAll(cfg.selectors.burst);
    bursts.forEach((container) => {
      const items = visibleChildren(container);
      if (items.length === 0) return;

      // Mismo patrón `set` + `to` que el reveal (evita la reversión
      // de `fromTo` con once, que dejaría los items invisibles).
      gsap.set(items, {
        x: () => gsap.utils.random(-cfg.burst.xRange, cfg.burst.xRange),
        y: () => gsap.utils.random(-cfg.burst.yRange, cfg.burst.yRange),
        rotation: () =>
          gsap.utils.random(-cfg.burst.rotRange, cfg.burst.rotRange),
        scale: cfg.burst.scale,
        autoAlpha: 0,
      });

      gsap.to(items, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        autoAlpha: 1,
        duration: cfg.burst.duration,
        ease: cfg.burst.ease,
        stagger: cfg.burst.stagger,
        scrollTrigger: {
          trigger: container,
          start: cfg.burst.start,
          once: cfg.burst.once,
        },
        onComplete: () => gsap.set(items, { clearProps: "transform" }),
      });
    });
  });

  return mm;
}
