import fs from 'node:fs';
import path from 'node:path';

export function resolvePublicAsset(assetPath?: string | null) {
  if (!assetPath || !assetPath.startsWith('/')) {
    return null;
  }

  const filePath = path.join(process.cwd(), 'public', assetPath.replace(/^\//, ''));
  return fs.existsSync(filePath) ? assetPath : null;
}
