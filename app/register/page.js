'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      alert('Registration successful! Please login.');
      router.push('/login');
    } else {
      const data = await res.json();
      alert(data.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-panel p-8 rounded-2xl border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Create an Account</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input className="input-dark" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="input-dark" type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} required />
          <input className="input-dark" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} required />
          <button className="btn-primary w-full py-3">Register</button>
        </form>
        <p className="text-sm text-gray-400 text-center mt-4">
          Already have an account? <Link href="/login" className="text-accent hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}