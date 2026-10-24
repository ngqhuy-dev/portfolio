import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});
const interTight = Inter_Tight({
  subsets: ['latin', 'vietnamese'],
  weight: ['800', '900'],
  variable: '--font-inter-tight',
  display: 'swap',
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const fontVariables = `${inter.variable} ${interTight.variable} ${jetBrainsMono.variable}`;
