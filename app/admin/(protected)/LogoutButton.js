'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }
  return (
    <button onClick={logout} className="w-full text-left px-3 py-2 rounded hover:bg-red-500/20 text-red-400 transition">
      🚪 Logout
    </button>
  );
}