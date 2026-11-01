export async function sendToTelegram({ title, description, poster, type, id }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!token || !chatId) {
    console.log('❌ Telegram Error: Token or Chat ID is missing in .env.local!');
    return;
  }

  const urlPath = type === 'movie' ? 'movies' : 'series';
  
  // 👇 මෙන්න මේක තමයි අලුතෙන් එකතු කළේ. 
  // අපි ඉන්නේ Localhost එකේ නම්, ටෙලිග්‍රෑම් එකට යවන්නේ ව්‍යාජ ලින්ක් එකක්. 
  // Deploy කළාට පස්සේ මේක ඔටෝම ඇත්ත ලින්ක් එකට මාරු වෙනවා.
  const finalBaseUrl = baseUrl.includes('localhost') ? 'https://tipix.com' : baseUrl;
  const url = `${finalBaseUrl}/${urlPath}/${id}`;

  const emoji = type === 'movie' ? '🎬' : '📺';
  const label = type === 'movie' ? 'Movie' : 'TV Series';

  const caption = `<b>${emoji} New ${label} Added!</b>\n\n<b>Title:</b> ${title}\n\n<b>Synopsis:</b> ${description ? description.substring(0, 200) + '...' : 'N/A'}`;

  const inlineKeyboard = {
    inline_keyboard: [[{ text: "▶️ Watch Now on Tipix", url: url }]]
  };

  try {
    if (poster) {
      console.log('📷 Sending with Photo:', poster);
      const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: poster,
          caption: caption,
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard
        })
      });

      const data = await res.json();
      console.log('📬 Telegram Response:', data);

      if (!data.ok) {
        console.log('⚠️ Photo failed, trying text only...');
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: caption,
            parse_mode: 'HTML',
            reply_markup: inlineKeyboard
          })
        });
      }
    } else {
      console.log('📝 Sending text only...');
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: caption,
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard
        })
      });
      const data = await res.json();
      console.log('📬 Telegram Response:', data);
    }
  } catch (error) {
    console.error('❌ Fetch Error:', error);
  }
}