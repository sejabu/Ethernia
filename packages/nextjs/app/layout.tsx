import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { Providers } from "~~/components/privyProvider";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { Metadata } from 'next';

// export const metadata = getMetadata({ title: "Ethernia", description: "Digital Inheritance made Easy" });

export const metadata: Metadata = {
  title: {
    template: '%s | Ethernia',
    default: 'ETHERNIA, Digital Inheritance made Easy',
  },
  description: 'Ethernia, Digital Inheritance Made Easy.',
  metadataBase: new URL('https://ethernia-test.vercel.app/'),
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="light" enableSystem={false}>
          <ScaffoldEthAppWithProviders><Providers>{children}</Providers></ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;

// import '~~/app/v2/ui/global.css';
// import { inter } from '~~/app/v2/ui/fonts';
// import { Metadata } from 'next';

//export const metadata: Metadata = {
//  title: {
//    template: '%s | Ethernia',
//    default: 'Ethernia, Digital Inheritance made Easy',
//  },
//  description: 'Ethernia, Digital Inheritance Made Easy.',
//  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
//};

// export default function RootLayout({
//export default function v2Layout({
//  children,
//}: {
//  children: React.ReactNode;
//}) {
//  return (
//    <html lang="en" suppressHydrationWarning>
//      <body className={`${inter.className} antialiased`}>{children}</body>
//    </html>
//  );
//}
