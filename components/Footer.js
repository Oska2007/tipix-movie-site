import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#05060a] border-t border-white/5 mt-16 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ප්‍රධාන කොටස */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* 1. ලෝගෝ සහ විස්තරය */}
          <div className="space-y-4">
            <Link href="/">
              <img 
                src="/logo.png" 
                alt="Tipix Logo" 
                className="h-12 w-auto object-contain" 
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed pr-4">
              Your ultimate destination for streaming movies and TV series online for free. Enjoy high-quality content anytime, anywhere.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/movies" className="hover:text-accent transition-colors">Movies</Link></li>
              <li><Link href="/series" className="hover:text-accent transition-colors">TV Series</Link></li>
            </ul>
          </div>

          {/* 3. Join Us (Telegram Links) */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Join Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {/* 👇 මේකෙ තියෙන ලින්ක් එක ඔයාගේ ටෙලිග්‍රෑම් චැනල් එකේ ලින්ක් එකට වෙනස් කරන්න */}
              <li>
                <a href="https://t.me/your_channel_link" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  Telegram Channel
                </a>
              </li>
              
              {/* 👇 මේකෙ තියෙන ලින්ක් එක ඔයාගේ ටෙලිග්‍රෑම් ගෲප් එකේ ලින්ක් එකට වෙනස් කරන්න */}
              <li>
                <a href="https://t.me/your_group_link" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  Telegram Group
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Contact Us */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:support@tipix.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  support@tipix.com
                </a>
              </li>
              <li>
                <a href="https://t.me/your_admin_link" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  Telegram Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* පහළම කොටස (Copyright) */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Tipix. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}