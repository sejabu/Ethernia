'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export const Providers = ({children}: {children: React.ReactNode}) => {
    if (!process.env.NEXT_PUBLIC_PRIVY_API_KEY) {
        throw new Error('NEXT_PUBLIC_PRIVY_API_KEY is not defined in environment variables');
      }
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_API_KEY}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: '/favicon.png',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}