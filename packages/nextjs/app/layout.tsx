import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({ title: "Ethernia", description: "Digital Inheritance made Easy" });

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
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
