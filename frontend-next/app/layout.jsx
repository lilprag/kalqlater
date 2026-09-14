import './globals.css';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalqlater.com';
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const gaEnabled = /^G-[A-Z0-9]+$/.test(measurementId || '');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'KalQLater',
  description: 'Something new is being built.',
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {gaEnabled && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(measurementId)});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
