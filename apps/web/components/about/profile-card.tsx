import { OptimizedImage } from '@/components/ui/optimized-image';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

import type { Page } from '@/lib/pages';

type ProfileCardProps = {
  avatarImage?: string | undefined;
  avatarText: string;
  company?: string | undefined;
  email?: string | undefined;
  location?: string | undefined;
  name: string;
  phone?: string | undefined;
  role: string;
  socials?: Page['socials'] | undefined;
};

const contactIconClassName = 'size-4 text-primary';

export function ProfileCard({
  avatarImage,
  avatarText,
  company,
  email,
  location,
  name,
  phone,
  role,
  socials,
}: ProfileCardProps) {
  return (
    <section className="glass-card overflow-hidden rounded-[2rem]">
      <div className="gradient-bg h-24 opacity-90" />
      <div className="space-y-6 px-6 pb-6">
        <div className="-mt-10 flex items-end justify-between gap-4">
          {avatarImage ? (
            <OptimizedImage
              alt={name}
              className="glass-card size-20 rounded-[1.75rem] border border-white/20 object-cover"
              height={80}
              src={avatarImage}
              width={80}
            />
          ) : (
            <div className="glass-card flex size-20 items-center justify-center rounded-[1.75rem] border border-white/20 text-2xl font-semibold text-foreground">
              {avatarText}
            </div>
          )}
          {company ? (
            <span className="inline-flex items-center rounded-full border border-border/80 bg-surface/85 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
              {company}
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{name}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{role}</p>
          </div>
        </div>

        {email || phone || location ? (
          <div className="space-y-3 border-t border-border/70 pt-5 text-sm text-foreground/85">
            {email ? (
              <a className="flex items-center gap-3 hover:text-primary" href={`mailto:${email}`}>
                <Mail className={contactIconClassName} />
                <span>{email}</span>
              </a>
            ) : null}

            {phone ? (
              <a className="flex items-center gap-3 hover:text-primary" href={`tel:${phone}`}>
                <Phone className={contactIconClassName} />
                <span>{phone}</span>
              </a>
            ) : null}

            {location ? (
              <div className="flex items-center gap-3">
                <MapPin className={contactIconClassName} />
                <span>{location}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        {socials?.length ? (
          <div className="space-y-3 border-t border-border/70 pt-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Elsewhere</p>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.href}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3 py-2 text-sm font-medium text-foreground/85 hover:text-primary"
                  href={social.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>{social.label}</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
