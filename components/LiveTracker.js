'use client';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 👈 uuid ඉම්පෝර්ට් කළා

export default function LiveTracker() {
  useEffect(() => {
    // බ්‍රව්සර් එකේ සේව් වෙච්ච ID එකක් තියෙනවද බලනවා, නැත්නම් අලුත් එකක් හදනවා
    let sessionId = localStorage.getItem('site_session_id');
    if (!sessionId) {
      sessionId = uuidv4(); // 👈 අලුත් අද්විතීය ID එකක් හදනවා
      localStorage.setItem('site_session_id', sessionId);
    }

    // සිග්නල් එක (Ping) එවන ෆන්ක්ෂන් එක
    const pingServer = () => {
      fetch('/api/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      }).catch(() => {}); // Error එකක් ආවොත් නිකන්ම ඉන්නවා
    };

    // පේජ් එක ලෝඩ් වුනාම එක පාරක් එවනවා
    pingServer();

    // ඊට පස්සේ තත්පර 60න් 60ට එවනවා (හෘද ස්පන්දනය වගේ)
    const interval = setInterval(pingServer, 60000);

    return () => clearInterval(interval);
  }, []);

  return null; // මේකෙන් UI එකක් පේන්නේ නෑ, නිකන්ම Background එකේ වැඩ කරනවා
}