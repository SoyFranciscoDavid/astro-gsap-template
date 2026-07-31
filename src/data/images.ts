import h1 from "@assets/images/h-1.png";
import c1 from "@assets/images/c-1.png";
import c2 from "@assets/images/c-2.png";
import c3 from "@assets/images/c-3.png";
import t1 from "@assets/images/t-1.avif";
import t2 from "@assets/images/t-2.avif";
import t3 from "@assets/images/t-3.avif";

export interface ImageData {
  src: string;
  width: number;
  height: number;
  format?: string;
}

export const heroImage: ImageData = {
  src: h1.src,
  width: h1.width,
  height: h1.height,
  format: h1.format,
};

export const collectionImages: ImageData[] = [
  { src: c1.src, width: c1.width, height: c1.height, format: c1.format },
  { src: c2.src, width: c2.width, height: c2.height, format: c2.format },
  { src: c3.src, width: c3.width, height: c3.height, format: c3.format },
];

export const testimonialImages: ImageData[] = [
  { src: t1.src, width: t1.width, height: t1.height, format: t1.format },
  { src: t2.src, width: t2.width, height: t2.height, format: t2.format },
  { src: t3.src, width: t3.width, height: t3.height, format: t3.format },
];
