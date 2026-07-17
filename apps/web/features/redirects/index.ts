import { blogRedirects } from './blog-redirects';
import { seriesRedirects } from './series-redirects';
import { tagRedirects } from './tag-redirects';

export const permanentRedirects = [...blogRedirects, ...tagRedirects, ...seriesRedirects];
