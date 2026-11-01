'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      router.push('/');
      router.refresh(); // Navbar එක අප්ඩේට් වෙන්න
    } else {
      alert('Invalid email or password');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-panel p-8 rounded-2xl border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="input-dark" type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} required />
          <input className="input-dark" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} required />
          <button className="btn-primary w-full py-3">Login</button>
        </form>
        <p className="text-sm text-gray-400 text-center mt-4">
          Don't have an account? <Link href="/register" className="text-accent hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}