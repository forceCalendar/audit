// Small presentational primitives shared by the page; ported from the
// forcecalendar.org design system (Section, SectionHeader, Eyebrow, Card,
// StatTile) in plain JavaScript.

const widths = {
  page: 'max-w-page',
  wide: 'max-w-5xl',
  narrow: 'max-w-4xl',
  prose: 'max-w-prose',
};

const spacings = {
  default: 'py-16 lg:py-20',
  compact: 'py-10 lg:py-14',
  none: '',
};

/** Page section with consistent horizontal padding, container width and rhythm. */
export function Section({ children, id, width = 'wide', tone = 'default', divider = false, spacing = 'default', className = '' }) {
  const toneCls = tone === 'sunken' ? 'bg-sunken border-y border-hairline' : divider ? 'border-t border-hairline' : '';
  return (
    <section id={id} className={`${toneCls} ${spacings[spacing]} ${className}`.trim()}>
      <div className={`${widths[width]} mx-auto px-6`}>{children}</div>
    </section>
  );
}

/** Small mono, uppercase label that sits above a heading. */
export function Eyebrow({ children, pill = false, className = '' }) {
  const text = 'font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-text';
  if (pill) {
    return (
      <span className={`inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 ring-1 ring-inset ring-accent-line/70 ${text} ${className}`}>
        {children}
      </span>
    );
  }
  return <span className={`inline-flex items-center gap-2 ${text} ${className}`}>{children}</span>;
}

/** Eyebrow + heading + lede; the one section header used across the page. */
export function SectionHeader({ title, subtitle, eyebrow, id, aside, className = '' }) {
  return (
    <div className={`mb-8 lg:mb-10 sm:flex sm:items-end sm:justify-between sm:gap-8 ${className}`}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-3">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}
        <h2 id={id} className="font-display text-display-md sm:text-[2.125rem] sm:leading-[1.12] sm:tracking-[-0.026em] font-semibold text-fg">
          {id ? (
            <a href={`#${id}`} className="decoration-line underline-offset-8 hover:underline">
              {title}
            </a>
          ) : (
            title
          )}
        </h2>
        {subtitle && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">{subtitle}</p>}
      </div>
      {aside && <div className="mt-5 flex-shrink-0 sm:mt-0">{aside}</div>}
    </div>
  );
}

const tones = {
  default: 'bg-raised ring-1 ring-hairline shadow-elev-1 dark:shadow-none ring-hi',
  accent: 'bg-accent-soft ring-1 ring-accent-line/60',
  sunken: 'bg-sunken ring-1 ring-hairline',
};

const paddings = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-8' };

/** Raised panel with the site's hairline + soft elevation. */
export function Card({ children, tone = 'default', padding = 'md', className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`relative min-w-0 rounded-xl ${tones[tone]} ${paddings[padding]} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

/** Hairline-separated sub-panel inside a padding="none" Card. */
export function CardSection({ children, tone = 'default', className = '' }) {
  const bg = tone === 'sunken' ? 'bg-sunken/70' : '';
  return <div className={`border-t border-hairline first:border-t-0 p-5 sm:p-6 ${bg} ${className}`.trim()}>{children}</div>;
}

/** One stat in a stat row: tabular numerals, quiet label. */
export function StatTile({ value, label, tone = 'default', children }) {
  const valueCls = tone === 'ok' ? 'text-ok' : tone === 'warn' ? 'text-warn' : 'text-fg';
  return (
    <div className="bg-raised px-5 py-5 text-center sm:py-6">
      <div className={`font-display text-3xl font-semibold tracking-[-0.03em] tabular sm:text-[2rem] ${valueCls}`}>{value}</div>
      <div className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">{label}</div>
      {children}
    </div>
  );
}

/** Container that lays StatTiles out as a divided strip. */
export function StatRow({ children, columns = 4 }) {
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
  return (
    // gap-px over the hairline colour draws dividers correctly however the grid wraps
    <div className={`grid grid-cols-2 ${cols} gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline shadow-elev-1 dark:shadow-none`}>
      {children}
    </div>
  );
}

const pillTones = {
  ok: 'pill-ok',
  warn: 'pill-warn',
  bad: 'pill-bad',
  accent: 'pill-accent',
  neutral: 'pill-neutral',
};

/** Severity / status pill. */
export function Pill({ tone = 'neutral', children, className = '' }) {
  return <span className={`pill ${pillTones[tone] || pillTones.neutral} ${className}`.trim()}>{children}</span>;
}

/** Inline code chip. */
export function Code({ children }) {
  return <code className="code">{children}</code>;
}

/** External-link glyph. */
export function ExternalIcon({ className = 'h-3 w-3' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

/** Plus-bullet list used for hardening notes and finding mitigations. */
export function PlusList({ items, className = '' }) {
  return (
    <ul className={`space-y-1.5 text-sm text-muted ${className}`.trim()}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-[3px] h-3.5 w-3.5 shrink-0 rounded-full bg-ok-soft text-center font-mono text-[10px] font-bold leading-[14px] text-ok ring-1 ring-inset ring-ok-line/70" aria-hidden>+</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
