import { Wordmark, GitHubIcon } from './Nav';

const productLinks = [
  { href: 'https://forcecalendar.org/core', label: 'Core' },
  { href: 'https://forcecalendar.org/interface', label: 'Interface' },
  { href: 'https://forcecalendar.org/salesforce', label: 'Salesforce' },
  { href: 'https://forcecalendar.org/platforms', label: 'Platforms' },
  { href: 'https://forcecalendar.org/playground', label: 'Playground' },
];

const resourceLinks = [
  { href: 'https://docs.forcecalendar.org', label: 'Documentation' },
  { href: 'https://docs.forcecalendar.org/core/api', label: 'API Reference' },
  { href: 'https://github.com/forcecalendar', label: 'GitHub' },
];

const communityLinks = [
  { href: 'https://www.npmjs.com/org/forcecalendar', label: 'npm' },
  { href: 'https://github.com/forcecalendar/core/issues', label: 'Issues' },
  { href: 'https://benchmark.forcecalendar.org', label: 'Benchmarks' },
  { href: 'https://github.com/forceCalendar/.github/blob/main/SECURITY.md', label: 'Security policy' },
  { href: 'https://github.com/forcecalendar/core/blob/master/LICENSE', label: 'MIT License' },
];

const badges = [
  { label: 'Zero Dependencies', path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  {
    label: 'MIT Licensed',
    path: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z',
  },
  { label: 'TypeScript', path: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
  {
    label: 'Locker Service Compatible',
    path: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  },
];

const linkCls = 'text-sm text-muted transition-colors hover:text-fg rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-subtle">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={linkCls}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-sunken">
      <div className="mx-auto max-w-page px-6 pb-10 pt-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-x-12">
          <div className="col-span-2 md:col-span-1">
            <Wordmark />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Calendar infrastructure for strict enterprise environments.
            </p>
            <a
              href="https://github.com/forcecalendar"
              className="mt-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              github.com/forcecalendar
            </a>
          </div>
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Community" links={communityLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Compatibility">
            {badges.map((b) => (
              <li key={b.label} className="inline-flex items-center gap-1.5 text-xs text-subtle">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={b.path} />
                </svg>
                {b.label}
              </li>
            ))}
          </ul>
          <p className="text-xs text-subtle">Self-assessment, published in the open.</p>
        </div>
      </div>
    </footer>
  );
}
