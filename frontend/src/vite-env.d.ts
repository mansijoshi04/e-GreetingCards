/// <reference types="vite/client" />

// SVG files — imported as URL strings
declare module '*.svg' {
  const src: string;
  export default src;
}
