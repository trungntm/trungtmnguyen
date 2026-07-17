import fs from 'fs/promises';
import path from 'path';

export const loadOgFonts = async () => {
  const fontMediumPath = path.join(process.cwd(), 'app/fonts/SpaceGrotesk-500.ttf');
  const fontBoldPath = path.join(process.cwd(), 'app/fonts/SpaceGrotesk-700.ttf');

  const [fontMedium, fontBold] = await Promise.all([
    fs.readFile(fontMediumPath),
    fs.readFile(fontBoldPath),
  ]);

  return [
    {
      name: 'Space Grotesk',
      data: fontMedium,
      style: 'normal' as const,
      weight: 500 as const,
    },
    {
      name: 'Space Grotesk',
      data: fontBold,
      style: 'normal' as const,
      weight: 700 as const,
    },
  ];
};

let fontsPromise: ReturnType<typeof loadOgFonts> | null = null;

export function getOgFonts() {
  if (!fontsPromise) {
    fontsPromise = loadOgFonts();
  }
  return fontsPromise;
}
