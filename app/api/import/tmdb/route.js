import { NextResponse } from 'next/server';

const TMDB_API = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

export async function POST(req) {
  try {
    const { query, type, action } = await req.json();

    if (action === 'search') {
      const res = await fetch(`${TMDB_API}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
      const data = await res.json();
      return NextResponse.json({ results: data.results?.slice(0, 5) || [] });
    } 
    
    if (action === 'details') {
      // 1. මූලික තොරතුරු
      const detailsRes = await fetch(`${TMDB_API}/${type}/${query}?api_key=${API_KEY}&language=en-US`);
      const details = await detailsRes.json();

      // 2. හැම පින්තූරයක්ම ගන්නවා (Posters & Backdrops)
      const imagesRes = await fetch(`${TMDB_API}/${type}/${query}/images?api_key=${API_KEY}&include_image_language=en,null`);
      const images = await imagesRes.json();

      const formattedData = {
        title: details.title || details.name,
        description: details.overview,
        year: (details.release_date || details.first_air_date) ? new Date(details.release_date || details.first_air_date).getFullYear() : null,
        rating: details.vote_average,
        duration: details.runtime ? `${details.runtime}m` : (details.number_of_seasons ? `${details.number_of_seasons} Seasons` : ''),
        genres: details.genres?.map(g => g.name).join(', ') || '',
        language: details.original_language === 'en' ? 'English' : details.original_language,
        // සියලුම පෝස්ටර්ස් සහ බැක්ඩ්‍රොප්ස් (URLs සමඟ)
        allPosters: (images.posters || []).slice(0, 10).map(p => `https://image.tmdb.org/t/p/w500${p.file_path}`),
        allBackdrops: (images.backdrops || []).slice(0, 10).map(b => `https://image.tmdb.org/t/p/original${b.file_path}`),
      };

      return NextResponse.json({ data: formattedData });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}