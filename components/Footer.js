'use client';

const productLinks = [
  { href: 'https://forcecalendar.org/core', label: 'Core' },
  { href: 'https://forcecalendar.org/interface', label: 'Interface' },
  { href: 'https://forcecalendar.org/salesforce', label: 'Salesforce' },
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
  { href: 'https://github.com/forcecalendar/core/blob/master/LICENSE', label: 'MIT License' },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
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
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-lg tracking-tight text-slate-900 dark:text-white mb-2">
              <span className="font-light">force</span>
              <span className="font-semibold">Calendar</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Calendar infrastructure for strict enterprise environments.
            </p>
          </div>
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Community" links={communityLinks} />
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Zero Dependencies
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" /></svg>
              MIT Licensed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
              TypeScript
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              Locker Service Compatible
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
