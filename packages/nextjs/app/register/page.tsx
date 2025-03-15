'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function RegisterPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [code, setCode] = useState('');

  const handleEmailSubmit = async () => {
    await fetch('/api/auth/send-code', { method: 'POST', body: JSON.stringify({ email }) });
    setStep('verify');
  };

  const handleCodeSubmit = async () => {
    const res = await fetch('/api/auth/verify-code', { method: 'POST', body: JSON.stringify({ email, code, walletAddress: session?.walletAddress }) });
    if (res.ok) window.location.href = '/dashboard';
  };

  return (
    <div>
      {step === 'input' ? (
        <>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="input input-bordered w-full" />
          <button onClick={handleEmailSubmit} className="btn btn-primary mt-4">Send Code</button>
        </>
      ) : (
        <>
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter verification code" className="input input-bordered w-full" />
          <button onClick={handleCodeSubmit} className="btn btn-primary mt-4">Verify</button>
        </>
      )}
    </div>
  );
}
