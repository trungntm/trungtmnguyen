import fs from 'fs/promises';
import path from 'path';

let faviconPromise: Promise<string> | null = null;

export function getFavicon() {
  if (!faviconPromise) {
    faviconPromise = (async () => {
      const iconPath = path.join(process.cwd(), 'public/favicons/apple-touch-icon.png');
      const buffer = await fs.readFile(iconPath);
      return `data:image/png;base64,${buffer.toString('base64')}`;
    })();
  }
  return faviconPromise;
}
