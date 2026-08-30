'use client';

import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';

const sites = [
  { href: 'https://forcecalendar.org', label: 'Website' },
  { href: 'https://docs.forcecalendar.org', label: 'Docs' },
  { href: 'https://benchmark.forcecalendar.org', label: 'Benchmark' },
  { href: 'https://audit.forcecalendar.org', label: 'Audit', current: true },
];

const pageLinks = [
  { href: '#supply-chain', label: 'Supply chain' },
  { href: '#csp', label: 'CSP' },
  { href: '#attack-surface', label: 'Attack surface' },
  { href: '#hardening', label: 'Hardening' },
  { href: '#remediation', label: 'Tracker' },
  { href: '#methodology', label: 'Methodology' },
];

export { sites, pageLinks };

export function Wordmark({ className = '' }) {
  return (
    <span className={`font-display text-[17px] tracking-[-0.02em] text-fg ${className}`}>
      <span className="font-normal">force</span>
      <span className="font-semibold">Calendar</span>
    </span>
  );
}

export function GitHubIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const iconButton =
  'flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-sunken hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // The hairline under the bar only appears once content scrolls beneath it
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentSite = sites.find((s) => s.current);

  return (
    <>
      <nav
        className={`sticky top-0 z-30 w-full border-b bg-surface/80 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-surface/70 ${
          scrolled ? 'border-hairline shadow-[0_1px_0_rgb(var(--hairline))]' : 'border-transparent'
        }`}
        aria-label="Primary"
      >
        <div className="mx-auto flex h-16 max-w-page items-center justify-between px-6">
          {/* Left: logo + site switcher */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://forcecalendar.org"
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <Wordmark />
            </a>

            <span className="select-none text-hairline" aria-hidden>/</span>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-8 items-center gap-1.5 rounded-md px-1.5 text-sm font-medium text-muted transition-colors hover:bg-sunken hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                aria-label="Switch site"
              >
                {currentSite?.label}
                <svg className={`h-3.5 w-3.5 text-subtle transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-52 rounded-lg bg-raised p-1 ring-1 ring-hairline shadow-elev-3 animate-fade-in" role="menu">
                  {sites.map((site) => (
                    <a
                      key={site.href}
                      href={site.href}
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                      className={`flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors ${
                        site.current ? 'bg-sunken font-medium text-fg' : 'text-muted hover:bg-sunken hover:text-fg'
                      }`}
                    >
                      {site.label}
                      {site.current && (
                        <svg className="h-3.5 w-3.5 text-accent-text" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: page-level links */}
          <div className="hidden items-center gap-0.5 text-sm md:flex">
            {pageLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-sunken hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface lg:px-3"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-0.5">
            <ThemeToggle />
            <a href="https://github.com/forcecalendar" className={iconButton} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`${iconButton} md:hidden`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
