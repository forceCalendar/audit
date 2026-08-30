'use client';

import { useEffect, useRef, useCallback } from 'react';
import { sites, pageLinks, Wordmark, GitHubIcon } from './Nav';

export default function MobileMenu({ open, onClose }) {
  const menuRef = useRef(null);
  const previousActiveElement = useRef(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousActiveElement.current = document.activeElement;
    const closeBtn = menuRef.current?.querySelector('button[aria-label="Close menu"]');
    if (closeBtn) closeBtn.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      // Focus trap
      if (e.key === 'Tab') {
        const focusable = menuRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previousActiveElement.current) previousActiveElement.current.focus();
    };
  }, [open, handleClose]);

  if (!open) return null;

  const item = (active) =>
    `flex items-center justify-between rounded-md px-3 py-2.5 text-[15px] transition-colors ${
      active ? 'bg-sunken font-medium text-fg' : 'text-muted hover:bg-sunken hover:text-fg'
    }`;

  const heading = 'mb-2 px-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-subtle';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-fg/40 backdrop-blur-sm md:hidden" onClick={handleClose} aria-hidden="true" />
      <div
        id="mobile-menu"
        ref={menuRef}
        className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,88vw)] flex-col border-l border-hairline bg-surface md:hidden animate-slide-in"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-hairline px-5">
          <Wordmark />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-sunken hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-5" aria-label="Mobile">
          <div>
            <div className={heading}>On this page</div>
            <div className="space-y-0.5">
              {pageLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={handleClose} className={item(false)}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className={heading}>Sites</div>
            <div className="space-y-0.5">
              {sites.map((site) => (
                <a key={site.href} href={site.href} onClick={handleClose} className={item(Boolean(site.current))}>
                  {site.label}
                  {site.current ? (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">here</span>
                  ) : (
                    <span aria-hidden className="text-subtle">&#8599;</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="border-t border-hairline p-3">
          <a href="https://github.com/forcecalendar" className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[15px] text-muted transition-colors hover:bg-sunken hover:text-fg">
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
