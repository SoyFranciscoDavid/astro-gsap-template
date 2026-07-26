// 1. Interfaces para tipar fuertemente la información
export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Nombre del icono de Iconify (ej: "ri:code-s-slash-line")
  tag?: string;
}

export interface WhyUsItem {
  title: string;
  description: string;
  icon: string;
  stat?: string; // Ejemplo: "+99%", "<100ms"
}

export interface TestimonialItem {
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
}

export interface SiteConfig {
  name: string;
  slogan: string;
  description: string;
  url: string;
  ogImage: string;
  author: string;
  twitterHandle: string;

  // Menús de navegación
  nav: NavItem[];

  // Datos de Secciones
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };

  services: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };

  whyUs: {
    title: string;
    subtitle: string;
    items: WhyUsItem[];
  };

  testimonials: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };

  contact: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
  };

  links: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

// 2. Exportación del Objeto Global
export const siteConfig: SiteConfig = {
  name: "NEXUS",
  slogan: "Diseño sólido. Código sin compromisos.",
  description:
    "Estudio de desarrollo web, arquitectura de software en Astro y animación avanzada con GSAP.",
  url: "https://midominio.com",
  ogImage: "/og-image.jpg",
  author: "Tu Agencia / Nombre",
  twitterHandle: "@tu_usuario",

  // Menú principal
  nav: [
    { label: "Servicios", href: "#services" },
    { label: "Por qué nosotros", href: "#why-us" },
    { label: "Testimonios", href: "#testimonials" },
    { label: "Contacto", href: "#contact" },
  ],

  // Hero Section
  hero: {
    badge: "Astro 4 + GSAP + Tailwind CSS",
    title: "Construimos experiencias web de",
    titleHighlight: "alto rendimiento",
    description:
      "Arquitectura escalable, animaciones ultra fluidas a 60fps y estricta atención al detalle visual sin penalizar la velocidad de carga.",
    primaryCta: { label: "Iniciar Proyecto", href: "#contact" },
    secondaryCta: { label: "Ver Servicios", href: "#services" },
  },

  // Sección Servicios
  services: {
    title: "Nuestras Especialidades",
    subtitle: "Soluciones de ingeniería y diseño pensadas para escalar.",
    items: [
      {
        id: "web-dev",
        title: "Desarrollo Web con Astro",
        description:
          "Sitios ultrarrápidos con 0 KB de JS por defecto, arquitectura limpia e integración perfecta con CMS headless.",
        icon: "ri:code-s-slash-line",
        tag: "Core",
      },
      {
        id: "ui-ux",
        title: "Diseño UI/UX & Micro-interacciones",
        description:
          "Interfaces visuales impactantes, sistemas de diseño escalables y pulido obsesivo de cada componente.",
        icon: "ri:layout-masonry-line",
      },
      {
        id: "gsap-anim",
        title: "Animaciones Avanzadas (GSAP)",
        description:
          "Experiencias interactivas con ScrollTrigger, timelines complejos y efectos visuales de primer nivel.",
        icon: "ri:magic-line",
      },
    ],
  },

  // Sección Por Qué Elegirnos (Why Us / Features)
  whyUs: {
    title: "Por qué trabajar con nosotros",
    subtitle:
      "Eliminamos la grasa del desarrollo tradicional para ofrecer la máxima calidad.",
    items: [
      {
        title: "Rendimiento Obsesivo",
        description:
          "Optimizamos cada asset y bundle de código para alcanzar métricas de 100/100 en Google Lighthouse.",
        icon: "ri:speed-up-line",
        stat: "100/100",
      },
      {
        title: "Código Estructurado",
        description:
          "Arquitectura limpia orientada a componentes, tipado estricto con TypeScript y fácil mantenimiento.",
        icon: "ri:cpu-line",
        stat: "TS",
      },
      {
        title: "Entrega Sin Sorpresas",
        description:
          "Metodología clara, entregables sólidos y soporte técnico directo sin intermediarios.",
        icon: "ri:shield-check-line",
        stat: "100%",
      },
    ],
  },

  // Sección Testimonios
  testimonials: {
    title: "Lo que dicen de nosotros",
    subtitle:
      "Clientes y colaboradores que respaldan la calidad de nuestro código.",
    items: [
      {
        quote:
          "La velocidad del sitio y la fluidez de las animaciones superaron por completo lo que teníamos planeado. Impecable trabajo de arquitectura.",
        author: {
          name: "Carlos Mendoza",
          role: "CTO",
          company: "TechFlow",
          avatar: "https://i.pravatar.cc/150?u=carlos",
        },
      },
      {
        quote:
          "Entienden la estética y el rendimiento como una sola cosa. No es solo que se ve bien, es que vuela.",
        author: {
          name: "Elena Rostova",
          role: "Head of Product",
          company: "Lumina Studio",
          avatar: "https://i.pravatar.cc/150?u=elena",
        },
      },
    ],
  },

  // Sección Contacto
  contact: {
    title: "Hablemos de tu próximo proyecto",
    subtitle:
      "¿Tenés una idea en mente? Nos encantaría evaluar cómo llevarla al siguiente nivel.",
    email: "contacto@agencia.com",
    phone: "+54 9 11 0000-0000",
    location: "Buenos Aires, Argentina",
  },

  // Redes Sociales
  links: {
    github: "https://github.com/tuusuario",
    linkedin: "https://linkedin.com/in/tuusuario",
    twitter: "https://x.com/tuusuario",
  },
};
