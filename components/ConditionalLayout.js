'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // ලින්ක් එක /admin වලින් පටන් ගන්නවා නම්, අපි ඉන්නේ Admin පැනලයේ
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {/* Admin පැනලයේ නෙවෙයි නම් විතරක් Navbar එක පෙන්නනවා */}
      {!isAdmin && <Navbar />}
      
      {/* Admin පැනලයේ නෙවෙයි නම් විතරක් උඩින් ඉඩ (padding) දෙනවා */}
      <main className={`flex-grow w-full ${!isAdmin ? 'pt-16 md:pt-20' : ''}`}>
        {children}
      </main>
      
      {/* Admin පැනලයේ නෙවෙයි නම් විතරක් Footer එක පෙන්නනවා */}
      {!isAdmin && <Footer />}
    </>
  );
}