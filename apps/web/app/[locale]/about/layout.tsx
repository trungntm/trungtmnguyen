import type { ReactNode } from 'react';

export default function LocalizedAboutRouteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <section className="page-container px-4 py-14 md:px-6 md:py-18">{children}</section>;
}
