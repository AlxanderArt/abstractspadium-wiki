import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abstractspadium Wiki',
  description: 'The living codex of Abstractspadium — a space drawn away from physical reality.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
