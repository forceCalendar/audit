import { Inter, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// All three faces are self-hosted at build time by next/font, so the page
// loads nothing from a font CDN at runtime.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const display = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0e14' },
  ],
};

export const metadata = {
  metadataBase: new URL('https://audit.forcecalendar.org'),
  title: 'forceCalendar Security Audit',
  description:
    'Transparent security self-assessment of forceCalendar: zero runtime dependencies, signed provenance, CSP requirements stated plainly, and every finding tracked in the open.',
  openGraph: {
    title: 'forceCalendar Security Audit',
    description: 'Transparent security self-assessment of forceCalendar.',
    url: 'https://audit.forcecalendar.org',
    siteName: 'forceCalendar',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

// Resolve the theme before first paint: the stored choice wins, otherwise the
// OS preference. Runs inline so neither theme flashes; the toggle keeps the
// same localStorage key.
const themeScript = `try{var s=localStorage.getItem("theme");var d=s==="dark"||(s!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} ${mono.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-surface text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
