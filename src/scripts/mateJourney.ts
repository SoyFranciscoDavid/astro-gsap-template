import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Viaje del "mate" (o cualquier elemento viajero) por el scroll.
 *
 * Un clon fixed del traveler arranca en su posición (K1), viaja al centro
 * del corredor (K2), se encamina a la card destino (K3) y al llegar se
 * "posa" dentro del slot (snap). El viaje es reversible: si volvés hacia
 * arriba, se despega del slot y retoma el camino en reversa.
 *
 * Pensado para reutilizar en otro proyecto: cambiá `selectors` y los
 * números finos de `keyframes`/`timing`/`entrance`. Todo lo demás se
 * calcula solo (posiciones a partir de los rects medidos en vivo).
 */

interface Keyframe {
  x: number;
  y: number;
  scale: number;
  rot: number;
}

export interface MateJourneyConfig {
  /** Viewport mínimo (px) para activar el viaje. */
  minWidth: number;
  selectors: {
    /** Elemento que viaja (se clona; debe quedar invisible en el layout). */
    traveler: string;
    /** Sección del corredor (el centro de esta sección = K2). */
    corridor: string;
    /** Grilla que se abre/cierra dentro del corredor. */
    corridorGrid: string;
    /** Slot destino donde el viajero reposa al final (K3/snap). */
    slot: string;
    /** Placeholder que se oculta cuando el viajero se posa. */
    ghost: string;
  };
  /** Clases que se quitan/ponen en la <img> del clon para que llene su rect. */
  imgClasses: { remove: string[]; add: string[] };
  keyframes: {
    /** Pose inicial: misma posición del hero, leve rotación + scale. */
    k1: { scale: number; rot: number };
    /** Centro del corredor, achicado. `offsetY` baja un poco más el viajero. */
    k2: { scale: number; rot: number; offsetY: number };
    /** Reposo sobre el slot. El scale se calcula solo (slot/hero). */
    k3: { rot: number };
  };
  entrance: {
    /** Pose con la que aparece el viajero (antes de llegar a K1). */
    scale: number;
    rot: number;
    duration: number;
    delay: number;
  };
  timing: {
    /** px de retraso en el arranque del segmento K2→K3 (hold en K2). */
    k3Delay: number;
    /**
     * px antes del centro en que el viajero ya está en K3.
     * `null` = automático: llega a K3 cuando la card entró 150px al viewport.
     */
    k3Lead: number | null;
  };
  corridor: {
    /** columnGap cerrado (antes/después de abrirse). */
    gap: string;
    /** columnGap abierto cuando la sección está al centro. */
    openGap: string;
  };
  zIndex: number;
}

const DEFAULTS: MateJourneyConfig = {
  minWidth: 1024,
  selectors: {
    traveler: "[data-mate]",
    corridor: "[data-process-section]",
    corridorGrid: "[data-process-grid]",
    slot: "[data-collection-slot]",
    ghost: "[data-collection-ghost]",
  },
  imgClasses: {
    // Ojo: la clase real de la <img> del hero es "w-70" (antes figuraba
    // "w-50" y no se removía → conflicto w-70 vs w-full en el clon).
    remove: ["w-70", "mx-auto", "h-auto", "max-w-md", "md:w-full"],
    add: ["w-full", "h-full", "object-cover"],
  },
  keyframes: {
    // k1 = misma pose del hero (escala 1, sin rotación) para que el clon
    // calce EXACTO con la imagen original oculta; antes rotaba 6° y
    // encogía 0.95 sobre la placa de fondo → se veía torcido/raro.
    k1: { scale: 1, rot: 0 },
    k2: { scale: 0.45, rot: 350, offsetY: 100 },
    // k3: 350 → 0 = una vuelta limpia que TERMINA DERECHA. Terminar rotado
    // (-10) dejaba al mate inclinado sobre el slot: su caja rotada (376×346)
    // sobresalía 23px por lado de la card (330×330) → se veía torcido/cortado
    // y el snap lo enderezaba de golpe. Terminando en 0 el snap es invisible.
    k3: { rot: 0 },
  },
  // delay menor: el clon aparece rápido y no queda la placa vacía en el hero
  // durante ~2s en desktop.
  entrance: { scale: 0.85, rot: -8, duration: 1.1, delay: 0.4 },
  timing: { k3Delay: 100, k3Lead: null },
  corridor: { gap: "1.5rem", openGap: "14rem" },
  zIndex: 60,
};

/** Permite sobreescribir solo los campos que se quieran ajustar. */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function mergeConfig(
  overrides: DeepPartial<MateJourneyConfig> = {},
): MateJourneyConfig {
  return {
    ...DEFAULTS,
    ...overrides,
    selectors: { ...DEFAULTS.selectors, ...overrides.selectors },
    imgClasses: {
      remove: overrides.imgClasses?.remove ?? DEFAULTS.imgClasses.remove,
      add: overrides.imgClasses?.add ?? DEFAULTS.imgClasses.add,
    },
    keyframes: {
      k1: { ...DEFAULTS.keyframes.k1, ...overrides.keyframes?.k1 },
      k2: { ...DEFAULTS.keyframes.k2, ...overrides.keyframes?.k2 },
      k3: { ...DEFAULTS.keyframes.k3, ...overrides.keyframes?.k3 },
    },
    entrance: { ...DEFAULTS.entrance, ...overrides.entrance },
    timing: { ...DEFAULTS.timing, ...overrides.timing },
    corridor: { ...DEFAULTS.corridor, ...overrides.corridor },
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function interp(k0: Keyframe, k1: Keyframe, t: number): Keyframe {
  return {
    x: lerp(k0.x, k1.x, t),
    y: lerp(k0.y, k1.y, t),
    scale: lerp(k0.scale, k1.scale, t),
    rot: lerp(k0.rot, k1.rot, t),
  };
}

/**
 * Inicia el viaje. Devuelve el matchMedia para poder `revert()` si hiciera
 * falta (no es necesario en uso normal).
 */
export function initMateJourney(
  overrides: DeepPartial<MateJourneyConfig> = {},
) {
  const cfg = mergeConfig(overrides);
  const mm = gsap.matchMedia();

  mm.add(`(min-width: ${cfg.minWidth}px)`, () => {
    const traveler = document.querySelector(cfg.selectors.traveler);
    const corridor = document.querySelector(cfg.selectors.corridor);
    const corridorGrid = document.querySelector(cfg.selectors.corridorGrid);
    const slot = document.querySelector(cfg.selectors.slot);
    const ghost = document.querySelector<HTMLElement>(cfg.selectors.ghost);

    if (!traveler || !corridor || !corridorGrid || !slot) return;

    const heroRect = traveler.getBoundingClientRect();
    const pRect = corridor.getBoundingClientRect();
    const cRect = slot.getBoundingClientRect();

    // ---- clon viajero (fixed sobre todo) ----
    const mate = traveler.cloneNode(true) as HTMLElement;
    mate.removeAttribute("data-mate");
    mate.setAttribute("aria-hidden", "true");
    const mateImg = mate.querySelector("img");
    if (mateImg) {
      mateImg.classList.remove(...cfg.imgClasses.remove);
      mateImg.classList.add(...cfg.imgClasses.add);
    }
    document.body.appendChild(mate);

    // ---- hitos en coordenadas de documento ----
    // El viajero arranca a moverse ni bien se scrollea (startScroll = 0)
    const startScroll = 0;
    const midScroll = pRect.top + pRect.height / 2 - window.innerHeight / 2; // K2: corredor al centro
    const endScroll = cRect.top + cRect.height / 2 - window.innerHeight / 2; // snap: slot al centro
    // Segmento 2 (K2→K3): arranca un ratito DESPUÉS del centro del corredor
    // y termina cuando la card ya entró al viewport, así el viajero queda
    // "pegado" al slot (viajando con él) durante toda la última sección,
    // en vez de seguir animándose despegado hasta el snap.
    const seg2Start = midScroll + cfg.timing.k3Delay;
    const k3Lead =
      cfg.timing.k3Lead ??
      Math.max(120, endScroll - (cRect.top - window.innerHeight + 150));
    const seg2End = endScroll - k3Lead;

    const finalScale = cRect.width / heroRect.width;

    // K1: pose inicial (misma posición, leve rotación + scale)
    const K1: Keyframe = {
      x: heroRect.left,
      y: heroRect.top,
      ...cfg.keyframes.k1,
    };
    // K2: centro del corredor, achicado
    const K2: Keyframe = {
      x: window.innerWidth / 2 - heroRect.width / 2,
      y:
        pRect.top +
        pRect.height / 2 -
        heroRect.height / 2 +
        cfg.keyframes.k2.offsetY,
      ...cfg.keyframes.k2,
    };
    // K3: reposa sobre el slot.
    // El transform-origin de GSAP es 50% 50%: para que el rect visual del
    // viajero quede exactamente centrado sobre la card, centramos el ORIGEN
    // del viajero (rect sin escalar) con el centro de la card.
    const K3: Keyframe = {
      x: cRect.left + cRect.width / 2 - heroRect.width / 2,
      y: cRect.top + cRect.height / 2 - heroRect.height / 2,
      scale: finalScale,
      ...cfg.keyframes.k3,
    };

    gsap.set(mate, {
      position: "fixed",
      left: 0,
      top: 0,
      margin: 0,
      width: heroRect.width,
      height: heroRect.height,
      zIndex: cfg.zIndex,
      pointerEvents: "none",
      willChange: "transform",
      x: K1.x,
      y: K1.y,
      scale: cfg.entrance.scale,
      rotation: cfg.entrance.rot,
      autoAlpha: 0,
    });

    // ---- entrada: el viajero aparece en su posición con rotación + escala ----
    const entrance = gsap.to(mate, {
      autoAlpha: 1,
      scale: K1.scale,
      rotation: K1.rot,
      duration: cfg.entrance.duration,
      delay: cfg.entrance.delay,
      ease: "power3.out",
    });

    const posFor = (s: number): Keyframe => {
      if (s <= seg2Start) {
        // t=1 → se queda en K2 hasta seg2Start (hold)
        return interp(
          K1,
          K2,
          clamp01((s - startScroll) / (midScroll - startScroll)),
        );
      }
      // t=1 → K3 siguiendo al slot hasta el snap
      return interp(K2, K3, clamp01((s - seg2Start) / (seg2End - seg2Start)));
    };

    let snapped = false;
    // evita re-entrada del onUpdate durante ScrollTrigger.refresh()
    let refreshing = false;

    const applyFixed = (s: number) => {
      const pos = posFor(s);
      gsap.set(mate, {
        x: pos.x,
        y: pos.y - s,
        scale: pos.scale,
        rotation: pos.rot,
      });
    };

    const snapIntoSlot = () => {
      if (snapped) return;
      snapped = true;
      entrance.kill();
      if (ghost) ghost.style.display = "none";
      slot.appendChild(mate);
      gsap.set(mate, {
        position: "static",
        width: "100%",
        height: "100%",
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        borderRadius: 0,
        boxShadow: "none",
        zIndex: "auto",
        pointerEvents: "auto",
      });
      refreshing = true;
      ScrollTrigger.refresh();
      refreshing = false;
    };

    // Despega el viajero del slot y retoma el viaje en reversa (K3 → K2 → K1)
    const unsnap = (s: number) => {
      if (!snapped) return;
      snapped = false;
      if (ghost) ghost.style.display = "";
      document.body.appendChild(mate);
      gsap.set(mate, {
        position: "fixed",
        left: 0,
        top: 0,
        margin: 0,
        width: heroRect.width,
        height: heroRect.height,
        zIndex: cfg.zIndex,
        pointerEvents: "none",
        willChange: "transform",
      });
      applyFixed(s);
      refreshing = true;
      ScrollTrigger.refresh();
      refreshing = false;
    };

    const startJourney = () => {
      // ---- viaje principal ----
      ScrollTrigger.create({
        trigger: traveler,
        start: () => startScroll,
        end: () => endScroll,
        // SIN scrub: Lenis ya suaviza el scroll, y el scrub desfasaba
        // self.scroll() del scroll real → el viajero se "despegaba" del
        // slot en scroll continuo y el snap disparaba tarde, de golpe.
        onUpdate: (self) => {
          if (refreshing) return;
          const s = self.scroll();
          if (snapped) {
            // Al volver hacia arriba, despegar el viajero del slot y
            // retomar el viaje en reversa. (Si seguimos bajando o nos
            // quedamos en el objetivo, se queda posado en la card.)
            if (s < endScroll - 5) unsnap(s);
            return;
          }
          applyFixed(s);
          if (s >= endScroll) snapIntoSlot();
        },
        onLeave: snapIntoSlot,
      });

      // ---- corredor: la grilla se abre y cierra ----
      // Un solo timeline evita el conflicto de immediateRender entre
      // dos fromTo sobre la misma propiedad (columnGap).
      gsap
        .timeline({
          scrollTrigger: {
            trigger: corridor,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        })
        .fromTo(
          corridorGrid,
          { columnGap: cfg.corridor.gap },
          { columnGap: cfg.corridor.openGap, ease: "none", duration: 1 },
        )
        .to(corridorGrid, {
          columnGap: cfg.corridor.gap,
          ease: "none",
          duration: 1,
        });
    };

    entrance.eventCallback("onComplete", startJourney);

    return () => {
      mate.remove();
    };
  });

  return mm;
}
