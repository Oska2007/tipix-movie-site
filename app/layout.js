import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // 👈 Footer එක import කළා

export const metadata = {
  title: 'Tipix — Movies & TV Series',
  description: 'Watch movies and TV series online.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text flex flex-col">
        <Navbar />
        <main className="flex-grow w-full pt-16 md:pt-20">
          {children}
        </main>
        <Footer /> {/* 👈 මෙතනින් Footer එක දාන්න */}
      </body>
    </html>
  );
}