import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Texas Civic Guide',
  description: 'Understand your city. Find the record. Know your rights.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
