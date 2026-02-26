'use client';

import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';

const sites = [
  { href: 'https://forcecalendar.org', label: 'Home' },
  { href: 'https://docs.forcecalendar.org', label: 'Docs' },
  { href: 'https://benchmark.forcecalendar.org', label: 'Benchmark' },
  { href: 'https://audit.forcecalendar.org', label: 'Audit', current: true },
];

const pageLinks = [
  { href: '#supply-chain', label: 'Supply Chain' },
  { href: '#csp', label: 'CSP' },
  { href: '#attack-surface', label: 'Attack Surface' },
  { href: '#remediation', label: 'Remediation' },
  { href: '#disclosure', label: 'Disclosure' },
];

export { sites, pageLinks };

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentSite = sites.find(s => s.current);

  return (
    <>
      <nav className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Left: Logo + site switcher */}
          <div className="flex items-center gap-3">
            <a href="https://forcecalendar.org" className="text-lg tracking-tight text-slate-900 dark:text-white">
              <span className="font-light">force</span>
              <span className="font-semibold">Calendar</span>
            </a>

            <span className="text-slate-300 dark:text-slate-700 select-none">/</span>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {currentSite?.label}
                <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                  {sites.map((site) => (
                    <a
                      key={site.href}
                      href={site.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`block px-3 py-2 text-sm ${
                        site.current
                          ? 'text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      } transition-colors`}
                    >
                      <span className="flex items-center justify-between">
                        {site.label}
                        {site.current && (
                          <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: page-level links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {pageLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <a
              href="https://github.com/forcecalendar"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 md:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
