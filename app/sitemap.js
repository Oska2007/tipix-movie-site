import { db } from '@/lib/db';
import { movies, series } from '@/lib/schema';

export default async function sitemap() {
  const baseUrl = 'https://tipix.com'; // පස්සේ ඔයාගේ ඩොමේන් එක දාන්න

  // ඩේටාබේස් එකෙන් ෆිල්ම්ස් සහ සීරීස් ගන්නවා
  const allMovies = db.select().from(movies).all();
  const allSeries = db.select().from(series).all();

  const movieUrls = allMovies.map((movie) => ({
    url: `${baseUrl}/movies/${movie.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const seriesUrls = allSeries.map((s) => ({
    url: `${baseUrl}/series/${s.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...movieUrls,
    ...seriesUrls,
  ];
}