// 1. Interfaces para tipar fuertemente la información
export interface NavItem {
  label: string;
  href: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface MetricItem {
  icon?: string;
  value: number;
  label: string;
  detail?: string;
  large?: boolean;
}

export interface TestimonialItem {
  quote: string;
  author: {
    name: string;
    role: string;
    initials: string;
  };
  featured?: boolean;
}

export interface FooterProduct {
  label: string;
  href: string;
}

export interface FooterInstitutional {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  slogan: string;
  description: string;
  url: string;
  ogImage: string;
  author: string;

  // Menús de navegación
  nav: NavItem[];

  // Datos de Secciones
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };

  process: {
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };

  collections: {
    title: string;
    subtitle: string;
    items: ProductItem[];
  };

  identity: {
    title: string;
    subtitle: string;
    description: string;
    metrics: MetricItem[];
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
    hours: string;
  };

  footer: {
    brief: string;
    products: FooterProduct[];
    institutional: FooterInstitutional[];
  };

  links: {
    instagram: string;
    linkedin: string;
    whatsapp: string;
    facebook: string;
  };
}

// 2. Exportación del Objeto Global
export const siteConfig: SiteConfig = {
  name: "Matero",
  slogan: "Sello de distinción en herencia artesanal argentina.",
  description:
    "Distribución mayorista y posicionamiento premium de mates imperiales, camioneros, termos y bombillas de alpaca para locales exclusivos.",
  url: "https://legadocriollo.com.ar",
  ogImage: "/og-image.jpg",
  author: "Legado Criollo",

  // Menú principal
  nav: [
    { label: "Inicio", href: "#home" },
    { label: "Proceso", href: "#craft" },
    { label: "Colecciones", href: "#collections" },
    { label: "Identidad", href: "#identity" },
    { label: "Contacto", href: "#contact" },
  ],

  // Hero Section
  hero: {
    badge: "Distribuidores Oficiales",
    title: "El mate argentino",
    description:
      "Distribución mayorista y posicionamiento premium de mates imperiales, camioneros, termos y bombillas de alpaca para locales exclusivos.",
    primaryCta: { label: "Catálogo", href: "#collections" },
    secondaryCta: { label: "Ver Líneas", href: "#collections" },
  },

  // Sección Proceso Artesanal
  process: {
    title: "El Valor de lo Hecho a Mano",
    subtitle: "Taller y Oficio",
    steps: [
      {
        number: "01",
        title: "Selección de Calabaza",
        description:
          "Cada pieza inicia en las plantaciones del litoral, donde seleccionamos únicamente los porongos de paredes gruesas y formas simétricas que aseguran una larga vida útil y un curado perfecto.",
      },
      {
        number: "02",
        title: "Costura en Cuero",
        description:
          "El revestimiento se realiza con cuero vacuno legítimo de exportación. Nuestros artesanos realizan costuras cruzadas a mano utilizando tientos seleccionados, logrando una tensión milimétrica estructural.",
      },
    ],
  },

  // Sección Colecciones
  collections: {
    title: "Líneas de Distribución",
    subtitle: "Catálogo de Selección",
    items: [
      {
        id: "camionero",
        name: "Línea Camionero",
        description:
          "Diseño sobrio de boca ancha para un cebado consistente. Comodidad absoluta para el uso diario.",
        image: "c-1.png",
      },
      {
        id: "imperial",
        name: "Línea Imperial",
        description:
          "Calabazas seleccionadas de grueso grosor, forradas en cuero vacuno virolas trabajadas en alpaca pura.",
        image: "c-2.png",
      },
      {
        id: "termos",
        name: "Termos de Gala",
        description:
          "Cuerpo de acero inoxidable de grado alimenticio con tecnología de vacío intermedio con retención térmica.",
        image: "c-3.png",
      },
    ],
  },

  // Sección Identidad & Métricas
  identity: {
    title: "Más que un Producto, una Institución",
    subtitle: "Cultura Federal",
    description:
      "El mate une distancias, sella acuerdos corporativos y define la identidad de nuestra tierra. Llevamos este ritual al segmento corporativo y de alta gama con el respeto que la tradición exige.",
    metrics: [
      {
        icon: "🏆",
        value: 23,
        label: "Provincias Abastecidas",
        detail: "Presencia en todo el territorio nacional",
        large: true,
      },
      {
        icon: "🌱",
        value: 100,
        label: "Materia Prima Local",
        detail: "Origen 100% argentino garantizado",
        large: true,
      },
      {
        icon: "⚒️",
        value: 15,
        label: "Talleres Asociados",
        detail: "Artesanos certificados en red",
        large: true,
      },
      {
        value: 5000,
        label: "Envíos Mensuales",
      },
      {
        value: 12,
        label: "Años de Trayectoria",
      },
      {
        value: 98,
        label: "% Satisfacción B2B",
      },
    ],
  },

  // Sección Testimonios
  testimonials: {
    title: "Voces del Sector",
    subtitle: "Lo que dicen nuestros aliados",
    items: [
      {
        quote:
          "Los mates imperiales transformaron la experiencia de nuestros clientes corporativos. La calidad artesanal se nota en cada detalle. Definitivamente el socio ideal para nuestra línea premium.",
        author: {
          name: "Martín Cárdenas",
          role: "Director Comercial, Café del Sur",
          initials: "MC",
        },
      },
      {
        quote:
          "Trabajamos con Legado Criollo hace más de 5 años. Su compromiso con la calidad y los tiempos de entrega los convierte en el distribuidor más confiable del mercado. Los termos de gala vuelven locos a nuestros compradores.",
        author: {
          name: "Laura Rodríguez",
          role: "Gerente de Compras, Almacén Criollo",
          initials: "LR",
        },
        featured: true,
      },
      {
        quote:
          "Como importador, la consistencia en el producto es clave. Legado Criollo mantiene estándares impecables en cada lote. La línea camionero es un éxito rotundo en nuestro catálogo internacional.",
        author: {
          name: "Diego Pereyra",
          role: "CEO, MateAr Export",
          initials: "DP",
        },
      },
    ],
  },

  // Sección Contacto
  contact: {
    title: "Contacto",
    subtitle: "Hablemos de tu negocio",
    email: "b2b@matefederal.com.ar",
    phone: "+54 11 1234-5678",
    location: "Buenos Aires, Argentina",
    hours: "Lun - Vie: 9:00 - 18:00 hs",
  },

  // Footer
  footer: {
    brief:
      "Sello de distinción en herencia artesanal argentina. Despachos consolidados a todo el territorio nacional.",
    products: [
      { label: "Línea Camionero", href: "#collections" },
      { label: "Línea Imperial", href: "#collections" },
      { label: "Termos de Gala", href: "#collections" },
      { label: "Bombillas Alpaca", href: "#collections" },
      { label: "Accesorios", href: "#collections" },
    ],
    institutional: [
      { label: "Nuestro Proceso", href: "#craft" },
      { label: "Cultura Federal", href: "#identity" },
      { label: "Testimonios", href: "#testimonials" },
      { label: "Términos Comerciales", href: "#" },
      { label: "Políticas de Calidad", href: "#" },
    ],
  },

  // Redes sociales
  links: {
    instagram: "https://instagram.com/legadocriollo",
    linkedin: "https://linkedin.com/company/legadocriollo",
    whatsapp: "https://wa.me/541112345678",
    facebook: "https://facebook.com/legadocriollo",
  },
};
