// Vercel Serverless Function for Global Live Like Counter

const OBJECT_ID = 'ff808181a09d98f701a0c40fa5dc617d';
const API_URL = `https://api.restful-api.dev/objects/${OBJECT_ID}`;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. Fetch current cloud count
    const getRes = await fetch(API_URL);
    let currentCount = 0;
    if (getRes.ok) {
      const data = await getRes.json();
      currentCount = data?.data?.count || 0;
    }

    if (req.method === 'POST') {
      // Increment count
      const newCount = currentCount + 1;
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'still_alive_atc_likes',
          data: { count: newCount }
        })
      });
      return res.status(200).json({ count: newCount });
    }

    if (req.method === 'DELETE') {
      // Decrement count
      const newCount = Math.max(0, currentCount - 1);
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'still_alive_atc_likes',
          data: { count: newCount }
        })
      });
      return res.status(200).json({ count: newCount });
    }

    // Default GET: return current count
    return res.status(200).json({ count: currentCount });
  } catch (error) {
    console.error('Like Counter API Error:', error);
    return res.status(500).json({ error: 'Failed to update like counter' });
  }
}
