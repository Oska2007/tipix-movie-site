export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login/', '/register/'], // Admin පැති Google එකට යන්න බෑ
    },
    sitemap: 'https://tipix.com/sitemap.xml', // පස්සේ ඔයාගේ ඩොමේන් එක දාන්න
  }
}