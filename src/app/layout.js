import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  metadataBase: new URL('https://brainbattery.vercel.app'),
  title: 'Brain Battery™ — 45-Second Cognitive & Reflex Challenge',
  description:
    'Test your reflex speed, impulse control, and working memory in 45 seconds. Check your Mental Age and challenge friends on WhatsApp.',
  openGraph: {
    title: '🔋 Brain Battery™ — Can you beat my score in 45s?',
    description:
      'Test your reflex speed, focus, and memory right in your browser. No signup required.',
    type: 'website',
    siteName: 'Brain Battery™',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🔋 Brain Battery™ — 45-Second Cognitive Challenge',
    description:
      'Test your reflex speed, focus, and memory in 45 seconds. Beat my score!',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white antialiased">
        {children}
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}