'use client';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-xl">Welcome, {session?.walletAddress}</h1>
    </div>
  );
}
