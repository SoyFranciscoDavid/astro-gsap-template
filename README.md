# Astro + GSAP + Tailwind Template

Plantilla base orientada a performance, arquitectura modular y animaciones de alta precisión.

## 🏗️ Estructura de Trabajo

- **Módulos de Animación:** Definir en `src/scripts/animations/*.ts` e importar dentro del bloque `<script>` de los componentes.
- **GSAP Instance:** Importar siempre desde `@scripts/gsap` para asegurar el registro de plugins.
- **Alias de Importación:** Utilizar `@components`, `@layouts`, `@styles`, `@scripts`, `@utils`, `@assets`.
- **Fuentes:** Ubicar fuentes `.woff2` en `src/assets/fonts/` y registrarlas en `src/styles/base.css`.

## 🚀 Comandos

```bash
npm install
npm run dev     # Servidor de desarrollo
npm run build   # Build de producción optimizado
```
