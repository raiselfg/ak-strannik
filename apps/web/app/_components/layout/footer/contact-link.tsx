import type { ReactNode } from 'react';

type ContactRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  note?: string;
};

export function ContactRow(props: ContactRowProps) {
  const className =
    'group hover:border-gold/35 grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 rounded-3xl border border-border/35 bg-background/25 p-3 transition-colors hover:bg-background/40 sm:gap-4 sm:rounded-4xl sm:p-4';
  const content = <ContactRowContent {...props} />;

  return props.href ? (
    <a href={props.href} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

function ContactRowContent({ icon, label, value, note }: ContactRowProps) {
  return (
    <>
      <div className="border-gold/25 bg-gold/10 text-gold flex size-11 items-center justify-center rounded-full border">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          {label}
        </p>
        <div className="mt-1 flex flex-col">
          <span className="text-base font-semibold break-words text-foreground sm:text-lg">
            {value}
          </span>
          {note ? (
            <span className="text-sm text-muted-foreground">{note}</span>
          ) : null}
        </div>
      </div>
    </>
  );
}

export function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="hover:border-gold/45 flex items-center justify-center rounded-4xl transition-transform hover:-translate-y-0.5"
    >
      <span className="inline-flex size-9 items-center justify-center">
        {children}
      </span>
    </a>
  );
}
