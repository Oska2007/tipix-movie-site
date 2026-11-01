import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';
import PWARegister from '@/components/PWARegister';
import InstallPWA from '@/components/InstallPWA';
import LiveTracker from '@/components/LiveTracker'; // 👈 මෙන්න මේක තමයි ආයේ එකතු කළේ

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'Tipix — Movies & TV Series',
    template: '%s | Tipix'
  },
  description: 'Watch the latest movies and TV series online for free in HD quality.',
  keywords: ['movies', 'tv series', 'watch online', 'free movies', 'tipix'],
  openGraph: {
    title: 'Tipix — Movies & TV Series',
    description: 'Watch the latest movies and TV series online for free.',
    url: 'https://tipix.com',
    siteName: 'Tipix',
    images: [{ url: '/logo.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#05060a" />
      </head>
      <body className="min-h-screen bg-bg text-text flex flex-col">
        <PWARegister />
        <InstallPWA />
        <LiveTracker /> {/* 👈 මෙන්න මේක දැම්මම තමයි සිග්නල් යන්නේ */}
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}