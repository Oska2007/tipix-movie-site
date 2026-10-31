'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) router.push('/admin');
    else setError('Invalid credentials');
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-panel p-8 rounded-xl border border-white/10">
      <h1 className="text-2xl font-bold mb-6 text-center">🔐 Admin Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="input-dark" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="input-dark" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  );
}